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
  const nearestDate = getNearestUpcomingDate(dayofweek, startmin);
  const { data, error } = await supabase
    .from("availability")
    .insert([
      {
        teacherid: teacherId,
        dayofweek,
        date:nearestDate.toISOString(),
        startmin,
        endmin,
        slotgranularity,
        isfree,
        active,
        kind,
        type,
        desc,
        price: price !== "" ? price : null,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(`Failed to create slot: ${error.message}`);
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
    .select("a_id, teacherid, dayofweek, startmin")
    .eq("a_id", slotId)
    .single();

  if (fetchError || !existing) throw new Error("Slot not found");
  if (existing.teacherid !== teacherId) throw new Error("Unauthorized: slot does not belong to this teacher");

  const {
    dayofweek, startmin, endmin, slotgranularity,
    isfree, active, kind, type, desc, price,
  } = updates;

  const payload = {};
  if (dayofweek     !== undefined) payload.dayofweek     = dayofweek;
  if (startmin      !== undefined) payload.startmin      = startmin;
  if (endmin        !== undefined) payload.endmin        = endmin;
  if (slotgranularity !== undefined) payload.slotgranularity = slotgranularity;
  if (isfree        !== undefined) payload.isfree        = isfree;
  if (active        !== undefined) payload.active        = active;
  if (kind          !== undefined) payload.kind          = kind;
  if (type          !== undefined) payload.type          = type;
  if (desc          !== undefined) payload.desc          = desc;
  if (price         !== undefined) payload.price         = price !== "" ? price : null;

  // Recalculate date if dayofweek or startmin changed
  // Fall back to existing DB values if one of them wasn't part of this update
  if (payload.dayofweek !== undefined || payload.startmin !== undefined) {
    const effectiveDay   = payload.dayofweek ?? existing.dayofweek;
    const effectiveStart = payload.startmin  ?? existing.startmin;
    payload.date = getNearestUpcomingDate(effectiveDay, effectiveStart).toISOString();
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
 
  const toInsert = slots
    .filter((s) => !s.a_id)
    .map((s) => ({
      teacherid: teacherId,
      dayofweek: s.dayofweek,
      date: getNearestUpcomingDate(s.dayofweek, s.startmin).toISOString(),
      startmin: s.startmin,
      endmin: s.endmin,
      slotgranularity: s.slotgranularity ?? 60,
      isfree: s.isfree ?? false,
      active: s.active ?? true,
      kind: s.kind || null,
      type: s.type || "plan",
      desc: s.desc || null,
      price: s.price !== "" ? s.price : null,
    }));
 
  const toUpdate = slots.filter((s) => s.a_id);
 
  const results = { inserted: [], updated: [], errors: [] };
 
  if (toInsert.length > 0) {
    const { data, error } = await supabase
      .from("availability")
      .insert(toInsert)
      .select();
    if (error) results.errors.push(`Insert failed: ${error.message}`);
    else results.inserted = data;
  }
 
  for (const slot of toUpdate) {
    try {
      const updated = await updateAvailabilitySlot(uid, slot.a_id, slot);
      results.updated.push(updated);
    } catch (err) {
      results.errors.push(`Update failed for a_id ${slot.a_id}: ${err.message}`);
    }
  }
 
  return results;
}