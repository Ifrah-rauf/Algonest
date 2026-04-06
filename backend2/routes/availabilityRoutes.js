import express from "express";
import {
    getAvailability,
    createSlot,
    updateSlot,
    toggleSlot,
    deleteSlot,
    bulkSave
} from "../controllers/availabilityController.js";
const router = express.Router();

// GET    /api/availability           → fetch all slots for teacher
// POST   /api/availability/create    → create one slot
// PUT    /api/availability/update/:slotId  → update one slot
// PATCH  /api/availability/toggle/:slotId  → toggle active
// DELETE /api/availability/delete/:slotId  → delete one slot
// POST   /api/availability/bulk-save → save all slots from UI at once

router.post("/", getAvailability);
router.post("/create", createSlot);
router.put("/update/:slotId", updateSlot);
router.patch("/toggle/:slotId", toggleSlot);
router.delete("/delete/:slotId", deleteSlot);
router.post("/bulk-save", bulkSave);

export default router;