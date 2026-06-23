import { supabase } from "../lib/supabase.js";
import dotenv from "dotenv";
dotenv.config();

// HELPER FUNCTIONS ------------------------------------------
//  * Resolves teacher's t_id from their auth uid

async function getTeacherIdByUid(uid) {
  const { data, error } = await supabase
    .from("teacher")
    .select("t_id")
    .eq("uid", uid)
    .single();

  if (error) throw new Error(`Teacher not found for uid ${uid}: ${error.message}`);
  return data.t_id;
}
function getNearestUpcomingDate(targetDayOfWeek, startmin) {
  const now = new Date();
  const todayDay = now.getDay(); // 0 (Sun) – 6 (Sat)
  const currentMin = now.getHours() * 60 + now.getMinutes();
 
  let diff = targetDayOfWeek - todayDay;
 
  if (diff > 0) {
    // Target is later this week — use as-is
  } else if (diff < 0) {
    // Target already passed this week → jump to next week
    diff += 7;
  } else {
    // Same day of week
    if (startmin > currentMin) {
      diff = 0; // slot is later today → use today
    } else {
      diff = 7; // slot time already passed → next week same day
    }
  }
 
  const result = new Date(now);
  result.setDate(now.getDate() + diff);
  // Zero out time — only the date matters for the `date` column
  result.setHours(0, 0, 0, 0);
  return result;
}

function formatLocalDateOnly(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function normalizeDateInput(dateValue, fallbackDate) {
  const raw = String(dateValue || "").trim();
  if (raw) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
    const parsed = formatLocalDateOnly(raw);
    if (parsed) return parsed;
  }

  return formatLocalDateOnly(fallbackDate);
}

function buildDateTimeString(dateOnly, minutes) {
  const raw = String(dateOnly || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;

  const year = raw.slice(0, 4);
  const month = raw.slice(5, 7);
  const day = raw.slice(8, 10);
  const hour = String(Math.floor(minutes / 60)).padStart(2, "0");
  const minute = String(minutes % 60).padStart(2, "0");

  return `${year}-${month}-${day} ${hour}:${minute}:00`;
}

function buildExpectedTimeslots(availabilityRow) {
  if (!availabilityRow) return [];

  const startmin = Number(availabilityRow.startmin);
  const endmin = Number(availabilityRow.endmin);
  const slotgranularity = Number(availabilityRow.slotgranularity || 30);
  const dateOnly = normalizeDateInput(availabilityRow.date, getNearestUpcomingDate(availabilityRow.dayofweek, startmin));

  if (!dateOnly || !Number.isFinite(startmin) || !Number.isFinite(endmin) || endmin <= startmin) {
    return [];
  }

  const slots = [];
  let currentStart = startmin;

  while (currentStart + slotgranularity <= endmin) {
    const currentEnd = currentStart + slotgranularity;
    const startat = buildDateTimeString(dateOnly, currentStart);
    const endat = buildDateTimeString(dateOnly, currentEnd);

    if (startat && endat) {
      slots.push({
        teacherid: availabilityRow.teacherid,
        availabilityid: availabilityRow.a_id,
        startat,
        endat,
        durationmin: slotgranularity,
        isbooked: false,
      });
    }

    currentStart += slotgranularity;
  }

  return slots;
}

async function syncTimeslotsForAvailability(availabilityRow) {
  if (!availabilityRow?.a_id) return null;

  const expected = buildExpectedTimeslots(availabilityRow);
  if (!expected.length) {
    return {
      protectedCount: 0,
      deletedCount: 0,
      insertedCount: 0,
      notice: null,
    };
  }

  console.debug("[syncTimeslots] rebuilding", {
    a_id: availabilityRow.a_id,
    teacherid: availabilityRow.teacherid,
    date: availabilityRow.date,
    dayofweek: availabilityRow.dayofweek,
    startmin: availabilityRow.startmin,
    endmin: availabilityRow.endmin,
    slotgranularity: availabilityRow.slotgranularity,
    expectedCount: expected.length,
  });

  const { data: existingSlots, error: existingSlotsError } = await supabase
    .from("timeslot")
    .select("slot_id, startat, endat, isbooked")
    .eq("availabilityid", availabilityRow.a_id);

  if (existingSlotsError) {
    console.error("[syncTimeslots] existing slot lookup failed", {
      a_id: availabilityRow.a_id,
      error: existingSlotsError,
    });
    throw existingSlotsError;
  }

  const existingSlotIds = (existingSlots || []).map((slot) => slot.slot_id).filter(Boolean);
  const { data: referencedRows, error: referencedError } = existingSlotIds.length
    ? await supabase
        .from("slotbooking")
        .select("slotid")
        .in("slotid", existingSlotIds)
    : { data: [], error: null };

  if (referencedError) {
    console.error("[syncTimeslots] slotbooking lookup failed", {
      a_id: availabilityRow.a_id,
      error: referencedError,
    });
    throw referencedError;
  }

  const referencedSlotIds = new Set((referencedRows || []).map((row) => row.slotid).filter(Boolean));
  const protectedSlots = (existingSlots || []).filter(
    (slot) => slot.isbooked === true || referencedSlotIds.has(slot.slot_id)
  );
  const deletableSlotIds = (existingSlots || [])
    .filter((slot) => slot.isbooked !== true && !referencedSlotIds.has(slot.slot_id))
    .map((slot) => slot.slot_id)
    .filter(Boolean);

  if (deletableSlotIds.length) {
    const { error: deleteError } = await supabase
      .from("timeslot")
      .delete()
      .in("slot_id", deletableSlotIds);

    if (deleteError) {
      console.error("[syncTimeslots] delete failed", {
        a_id: availabilityRow.a_id,
        error: deleteError,
      });
      throw deleteError;
    }
  }

  const protectedTimeKeys = new Set(
    protectedSlots.map((slot) => `${slot.startat}|${slot.endat}`)
  );
  const slotsToInsert = expected.filter(
    (slot) => !protectedTimeKeys.has(`${slot.startat}|${slot.endat}`)
  );

  if (!slotsToInsert.length) {
    console.debug("[syncTimeslots] no new slots needed", {
      a_id: availabilityRow.a_id,
      protectedCount: protectedSlots.length,
      deletedCount: deletableSlotIds.length,
    });
    return {
      protectedCount: protectedSlots.length,
      deletedCount: deletableSlotIds.length,
      insertedCount: 0,
      notice: protectedSlots.length
        ? "Booked sessions were kept unchanged."
        : null,
    };
  }

  const { error: insertError } = await supabase
    .from("timeslot")
    .insert(slotsToInsert);

  if (insertError) {
    console.error("[syncTimeslots] insert failed", {
      a_id: availabilityRow.a_id,
      error: insertError,
      sample: expected[0] || null,
    });
    throw insertError;
  }

  console.debug("[syncTimeslots] success", {
    a_id: availabilityRow.a_id,
    protectedCount: protectedSlots.length,
    deletedCount: deletableSlotIds.length,
    inserted: slotsToInsert.length,
  });

  return {
    protectedCount: protectedSlots.length,
    deletedCount: deletableSlotIds.length,
    insertedCount: slotsToInsert.length,
    notice: protectedSlots.length
      ? "Booked sessions were kept unchanged."
      : null,
  };
}

function normalizeSlotType(type, isfree) {
  const cleanType = String(type || "").trim().toLowerCase();
  if (cleanType === "free") return "session";
  if (cleanType === "session") return "session";
  if (cleanType === "plan") return "plan";
  return isfree ? "session" : "plan";
}
// HELPER FUNCTIONS END------------------------------------------

//  * Fetch all availability slots for a teacher
export async function getAvailabilityByTeacher(uid) {
  const teacherId = await getTeacherIdByUid(uid);

  const { data, error } = await supabase
    .from("availability")
    .select(`
      a_id,
      teacherid,
      dayofweek,
      date,
      startmin,
      endmin,
      slotgranularity,
      isfree,
      active,
      kind,
      type,
      desc,
      price
    `)
    .eq("teacherid", teacherId)
    .order("dayofweek", { ascending: true })
    .order("startmin", { ascending: true });

  if (error) throw new Error(`Failed to fetch availability: ${error.message}`);
  return data;
}

/**
 * Create a new availability slot
 */
export async function createAvailabilitySlot(uid, slotData) {
  const teacherId = await getTeacherIdByUid(uid);

  const {
    dayofweek,
    date = null,
    startmin,
    endmin,
    slotgranularity = 60,
    isfree = false,
    active = true,
    kind = null,
    type = "plan",
    desc = null,
    price = null,
  } = slotData;

  // Basic validation
  if (startmin == null || endmin == null || dayofweek == null) {
    throw new Error("dayofweek, startmin, and endmin are required");
  }
  if (endmin <= startmin) {
    throw new Error("endmin must be greater than startmin");
  }
  const normalizedType = normalizeSlotType(type, isfree);
  const nearestDate = getNearestUpcomingDate(dayofweek, startmin);
  const normalizedDate = normalizeDateInput(date, nearestDate);
  console.debug("[createAvailabilitySlot] incoming", {
    uid,
    teacherId,
    dayofweek,
    date,
    normalizedDate,
    startmin,
    endmin,
    slotgranularity,
    isfree,
    type,
    normalizedType,
    active,
    kind,
    price,
  });
  const { data, error } = await supabase
    .from("availability")
    .insert([
      {
        teacherid: teacherId,
        dayofweek,
        date: normalizedDate,
        startmin,
        endmin,
        slotgranularity,
        isfree,
        active,
        kind,
        type: normalizedType,
        desc,
        price: price !== "" ? price : null,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(`Failed to create slot: ${error.message}`);
  try {
    data._timeslotSync = await syncTimeslotsForAvailability(data);
  } catch (timeslotError) {
    console.error("[createAvailabilitySlot] timeslot sync failed:", timeslotError.message);
    throw new Error(`Slot saved but timeslot sync failed: ${timeslotError.message}`);
  }
  console.debug("[createAvailabilitySlot] saved", { a_id: data.a_id, teacherid: data.teacherid });
  return data;
}

/**
 * Update an existing availability slot
 * Verifies ownership before updating
 */
export async function updateAvailabilitySlot(uid, slotId, updates) {
  const teacherId = await getTeacherIdByUid(uid);

  // Ownership check — fetch existing day/startmin too for date recalculation
  const { data: existing, error: fetchError } = await supabase
    .from("availability")
    .select("a_id, teacherid, dayofweek, startmin, date")
    .eq("a_id", slotId)
    .single();

  if (fetchError || !existing) throw new Error("Slot not found");
  if (existing.teacherid !== teacherId) throw new Error("Unauthorized: slot does not belong to this teacher");

  const {
    dayofweek, date, startmin, endmin, slotgranularity,
    isfree, active, kind, type, desc, price,
  } = updates;
  const normalizedType = normalizeSlotType(type, isfree);
  console.debug("[updateAvailabilitySlot] incoming", {
    uid,
    slotId,
    existing,
    updates,
    normalizedType,
  });

  const payload = {};
  if (dayofweek     !== undefined) payload.dayofweek     = dayofweek;
  if (startmin      !== undefined) payload.startmin      = startmin;
  if (endmin        !== undefined) payload.endmin        = endmin;
  if (slotgranularity !== undefined) payload.slotgranularity = slotgranularity;
  if (isfree        !== undefined) payload.isfree        = isfree;
  if (active        !== undefined) payload.active        = active;
  if (kind          !== undefined) payload.kind          = kind;
  if (type          !== undefined) payload.type          = normalizedType;
  if (desc          !== undefined) payload.desc          = desc;
  if (price         !== undefined) payload.price         = price !== "" ? price : null;
  if (date          !== undefined) payload.date          = normalizeDateInput(date, getNearestUpcomingDate(payload.dayofweek ?? existing.dayofweek, payload.startmin ?? existing.startmin));

  // Recalculate date if dayofweek or startmin changed
  // Fall back to existing DB values if one of them wasn't part of this update
  if (payload.dayofweek !== undefined || payload.startmin !== undefined) {
    const effectiveDay   = payload.dayofweek ?? existing.dayofweek;
    const effectiveStart = payload.startmin  ?? existing.startmin;
    payload.date = formatLocalDateOnly(getNearestUpcomingDate(effectiveDay, effectiveStart));
  }

  if (payload.startmin != null && payload.endmin != null && payload.endmin <= payload.startmin) {
    throw new Error("endmin must be greater than startmin");
  }

  const { data, error } = await supabase
    .from("availability")
    .update(payload)
    .eq("a_id", slotId)
    .select()
    .single();

  if (!error) console.log("updated slot: ", data);
  if (error) throw new Error(`Failed to update slot: ${error.message}`);
  try {
    data._timeslotSync = await syncTimeslotsForAvailability(data);
  } catch (timeslotError) {
    console.error("[updateAvailabilitySlot] timeslot sync failed:", timeslotError.message);
    throw new Error(`Slot saved but timeslot sync failed: ${timeslotError.message}`);
  }
  console.debug("[updateAvailabilitySlot] saved", {
    a_id: data.a_id,
    dayofweek: data.dayofweek,
    date: data.date,
    startmin: data.startmin,
    endmin: data.endmin,
    type: data.type,
  });
  return data;
}

/**
 * Toggle active status of a slot
 */
export async function toggleSlotActive(uid, slotId) {
  const teacherId = await getTeacherIdByUid(uid);

  const { data: existing, error: fetchError } = await supabase
    .from("availability")
    .select("a_id, teacherid, active")
    .eq("a_id", slotId)
    .single();

  if (fetchError || !existing) throw new Error("Slot not found");
  if (existing.teacherid !== teacherId) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("availability")
    .update({ active: !existing.active })
    .eq("a_id", slotId)
    .select()
    .single();

  if (error) throw new Error(`Failed to toggle slot: ${error.message}`);
  return data;
}

/**
 * Delete an availability slot
 * Verifies ownership before deleting
 */
export async function deleteAvailabilitySlot(uid, slotId) {
  const teacherId = await getTeacherIdByUid(uid);

  const { data: existing, error: fetchError } = await supabase
    .from("availability")
    .select("a_id, teacherid")
    .eq("a_id", slotId)
    .single();

  if (fetchError || !existing) throw new Error("Slot not found");
  if (existing.teacherid !== teacherId) throw new Error("Unauthorized: slot does not belong to this teacher");

  const { data: existingSlots, error: timeslotError } = await supabase
    .from("timeslot")
    .select("slot_id, isbooked")
    .eq("availabilityid", slotId);

  if (timeslotError) throw new Error(`Failed to check booked sessions: ${timeslotError.message}`);

  const slotIds = (existingSlots || []).map((slot) => slot.slot_id).filter(Boolean);
  const { data: referencedRows, error: referenceError } = slotIds.length
    ? await supabase.from("slotbooking").select("slotid").in("slotid", slotIds)
    : { data: [], error: null };

  if (referenceError) throw new Error(`Failed to check booked sessions: ${referenceError.message}`);

  const hasBookedSessions =
    (existingSlots || []).some((slot) => slot.isbooked === true) ||
    (referencedRows || []).length > 0;

  if (hasBookedSessions) {
    throw new Error("This availability has booked sessions. Keep it inactive instead of deleting it.");
  }

  const { error: deleteTimeslotsError } = await supabase
    .from("timeslot")
    .delete()
    .eq("availabilityid", slotId);

  if (deleteTimeslotsError) {
    throw new Error(`Failed to delete generated timeslots: ${deleteTimeslotsError.message}`);
  }

  const { error } = await supabase
    .from("availability")
    .delete()
    .eq("a_id", slotId);

  if (error) throw new Error(`Failed to delete slot: ${error.message}`);
  return { deleted: true, a_id: slotId };
}

/**
 * Bulk save — replaces all slots with a new set for the teacher
 * Used when teacher hits "Save Changes" with the full slot list
 */
export async function bulkSaveAvailability(uid, slots) {
  const teacherId = await getTeacherIdByUid(uid);
  console.debug("[bulkSaveAvailability] start", {
    uid,
    teacherId,
    totalSlots: slots?.length || 0,
    existing: (slots || []).filter((s) => s.a_id).length,
    newSlots: (slots || []).filter((s) => !s.a_id).length,
  });
 
  const toInsert = slots
    .filter((s) => !s.a_id)
    .map((s) => ({
      teacherid: teacherId,
      dayofweek: s.dayofweek,
      date: normalizeDateInput(s.date, getNearestUpcomingDate(s.dayofweek, s.startmin)),
      startmin: s.startmin,
      endmin: s.endmin,
      slotgranularity: s.slotgranularity ?? 60,
      isfree: s.isfree ?? false,
      active: s.active ?? true,
      kind: s.kind || null,
      type: normalizeSlotType(s.type, s.isfree),
      desc: s.desc || null,
      price: s.price !== "" ? s.price : null,
    }));
 
  const toUpdate = slots.filter((s) => s.a_id);
 
  const results = {
    inserted: [],
    updated: [],
    errors: [],
    notices: [],
    timeslotSync: {
      protectedCount: 0,
      deletedCount: 0,
      insertedCount: 0,
    },
  };
 
  if (toInsert.length > 0) {
    console.debug("[bulkSaveAvailability] inserting", { count: toInsert.length, sample: toInsert[0] });
    const { data, error } = await supabase
      .from("availability")
      .insert(toInsert)
      .select();
    if (error) {
      console.error("[bulkSaveAvailability] insert failed", error);
      results.errors.push(`Insert failed: ${error.message}`);
    }
    else {
      results.inserted = data;
      for (const row of data || []) {
        try {
          row._timeslotSync = await syncTimeslotsForAvailability(row);
          if (row._timeslotSync) {
            results.timeslotSync.protectedCount += row._timeslotSync.protectedCount || 0;
            results.timeslotSync.deletedCount += row._timeslotSync.deletedCount || 0;
            results.timeslotSync.insertedCount += row._timeslotSync.insertedCount || 0;
            if (row._timeslotSync.notice) results.notices.push(row._timeslotSync.notice);
          }
        } catch (timeslotError) {
          console.error("[bulkSaveAvailability] timeslot sync failed", {
            a_id: row.a_id,
            error: timeslotError,
          });
          results.errors.push(`Timeslot sync failed for a_id ${row.a_id}: ${timeslotError.message}`);
        }
      }
    }
  }
 
  for (const slot of toUpdate) {
    try {
      console.debug("[bulkSaveAvailability] updating", { a_id: slot.a_id, slot });
      const updated = await updateAvailabilitySlot(uid, slot.a_id, slot);
      results.updated.push(updated);
      if (updated._timeslotSync) {
        results.timeslotSync.protectedCount += updated._timeslotSync.protectedCount || 0;
        results.timeslotSync.deletedCount += updated._timeslotSync.deletedCount || 0;
        results.timeslotSync.insertedCount += updated._timeslotSync.insertedCount || 0;
        if (updated._timeslotSync.notice) results.notices.push(updated._timeslotSync.notice);
      }
    } catch (err) {
      console.error("[bulkSaveAvailability] update failed", { a_id: slot.a_id, err });
      results.errors.push(`Update failed for a_id ${slot.a_id}: ${err.message}`);
    }
  }

  results.notices = [...new Set(results.notices)];

  console.debug("[bulkSaveAvailability] result", results);
 
  return results;
}
