import {
  // getTeacherIdByUid,
  getAvailabilityByTeacher,
  createAvailabilitySlot,
  updateAvailabilitySlot,
  toggleSlotActive,
  deleteAvailabilitySlot,
  bulkSaveAvailability
} from "../services/availabilityService.js";

/**
 * GET /api/availability
 * Fetch all availability slots for the logged-in teacher
 * Requires: uid in req.body or req.user (depending on your auth middleware)
 */
export async function getAvailability(req, res) {
  try {
    const uid = req.body.uid || req.user?.uid;
    if (!uid) return res.status(401).json({ success: false, message: "Unauthorized: uid missing" });

    const data = await getAvailabilityByTeacher(uid);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("[getAvailability]", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * POST /api/availability/create
 * Create a single new availability slot
 * Body: { uid, dayofweek, startmin, endmin, slotgranularity, type, isfree, price, desc, active, kind }
 */
export async function createSlot(req, res) {
  try {
    const { uid, ...slotData } = req.body;
    if (!uid) return res.status(401).json({ success: false, message: "Unauthorized: uid missing" });

    const data = await createAvailabilitySlot(uid, slotData);
    return res.status(201).json({ success: true, data });
  } catch (error) {
    console.error("[createSlot]", error.message);
    const statusCode = error.message.includes("required") ? 400 : 500;
    return res.status(statusCode).json({ success: false, message: error.message });
  }
}

/**
 * PUT /api/availability/update/:slotId
 * Update an existing availability slot
 * Body: { uid, ...fields to update }
 */
export async function updateSlot(req, res) {
  try {
    const { slotId } = req.params;
    const { uid, ...updates } = req.body;

    if (!uid) return res.status(401).json({ success: false, message: "Unauthorized: uid missing" });
    if (!slotId) return res.status(400).json({ success: false, message: "slotId param is required" });

    const data = await updateAvailabilitySlot(uid, Number(slotId), updates);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("[updateSlot]", error.message);
    const statusCode = error.message.includes("Unauthorized") ? 403
      : error.message.includes("not found") ? 404
      : 500;
    return res.status(statusCode).json({ success: false, message: error.message });
  }
}

/**
 * PATCH /api/availability/toggle/:slotId
 * Toggle the active status of a slot
 * Body: { uid }
 */
export async function toggleSlot(req, res) {
  try {
    const { slotId } = req.params;
    const uid = req.body.uid || req.user?.uid;

    if (!uid) return res.status(401).json({ success: false, message: "Unauthorized: uid missing" });

    const data = await toggleSlotActive(uid, Number(slotId));
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("[toggleSlot]", error.message);
    const statusCode = error.message.includes("Unauthorized") ? 403
      : error.message.includes("not found") ? 404
      : 500;
    return res.status(statusCode).json({ success: false, message: error.message });
  }
}

/**
 * DELETE /api/availability/delete/:slotId
 * Delete an availability slot
 * Body: { uid }
 */
export async function deleteSlot(req, res) {
  try {
    const { slotId } = req.params;
    const uid = req.body.uid || req.user?.uid;

    if (!uid) return res.status(401).json({ success: false, message: "Unauthorized: uid missing" });

    const data = await deleteAvailabilitySlot(uid, Number(slotId));
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("[deleteSlot]", error.message);
    const statusCode = error.message.includes("Unauthorized") ? 403
      : error.message.includes("not found") ? 404
      : 500;
    return res.status(statusCode).json({ success: false, message: error.message });
  }
}

/**
 * POST /api/availability/bulk-save
 * Save the full availability list from the UI in one shot
 * Body: { uid, slots: [...] }
 * Each slot: { a_id? (if existing), dayofweek, startmin, endmin, ... }
 */
export async function bulkSave(req, res) {
  try {
    const { uid, slots } = req.body;

    if (!uid) return res.status(401).json({ success: false, message: "Unauthorized: uid missing" });
    if (!Array.isArray(slots)) return res.status(400).json({ success: false, message: "slots must be an array" });

    console.debug("[bulkSave controller] incoming", {
      uid,
      slotCount: slots.length,
      newSlots: slots.filter((s) => !s.a_id).length,
      existingSlots: slots.filter((s) => s.a_id).length,
    });

    const result = await bulkSaveAvailability(uid, slots);

    // Return partial success info if some slots had errors
    const status = result.errors.length > 0 ? 207 : 200;
    console.debug("[bulkSave controller] outgoing", {
      status,
      inserted: result.inserted?.length || 0,
      updated: result.updated?.length || 0,
      errors: result.errors,
    });
    return res.status(status).json({ success: true, data: result });
  } catch (error) {
    console.error("[bulkSave]", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
}
