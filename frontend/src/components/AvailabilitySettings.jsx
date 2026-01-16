import React, { useState } from "react";

/**
 * AvailabilitySettings
 * --------------------
 * Props required from backend:
 * - avail: Array of availability rows from DB (must include a_id)
 * - teacherId: current teacher's id
 */
export default function AvailabilitySettings({ avail = [], teacherId }) {

  const DAY_LABELS = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

  /* ================= STATE ================= */

  // All existing + newly added slots
  const [slots, setSlots] = useState(avail);

  // a_id of slot currently being edited (null = add mode)
  const [editingId, setEditingId] = useState(null);

  // Default empty form aligned with DB columns
  const emptyForm = {
    kind: "WEEKLY",
    dayofweek: 1,
    date: "",
    startmin: 0,
    endmin: 30,
    slotgranularity: 30,
    isfree: true,
    active: true,
    type: "plan",
    desc: "",
    price: 0,
  };

  // Controlled form state
  const [form, setForm] = useState(emptyForm);

  /* ================= HELPERS ================= */

  // Generate 30-min time options (00:00 → 23:30)
  const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
    const mins = i * 30;
    const h = String(Math.floor(mins / 60)).padStart(2, "0");
    const m = String(mins % 60).padStart(2, "0");
    return { label: `${h}:${m}`, value: mins };
  });

  // Generic input handler
  const updateForm = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Toggle boolean fields
  const toggle = (key) =>
    setForm((prev) => ({ ...prev, [key]: !prev[key] }));

  /* ================= ADD / UPDATE ================= */

  const saveSlot = () => {
    // Validation: end must be >= start + 30
    if (form.endmin <= form.startmin) {
      alert("End time must be after start time");
      return;
    }

    if (editingId) {
      // Update existing slot
      setSlots((prev) =>
        prev.map((s) =>
          s.a_id === editingId ? { ...s, ...form } : s
        )
      );
    } else {
      // Add new slot (temporary id for frontend)
      setSlots((prev) => [
        ...prev,
        { ...form, a_id: Date.now(), teacher_id: teacherId },
      ]);
    }

    // Reset form
    setForm(emptyForm);
    setEditingId(null);
  };

  /* ================= EDIT / DELETE ================= */

  const editSlot = (slot) => {
    setEditingId(slot.a_id);
    setForm({
      kind: slot.kind,
      dayofweek: slot.dayofweek,
      date: slot.date || "",
      startmin: slot.startmin,
      endmin: slot.endmin,
      slotgranularity: slot.slotgranularity,
      isfree: slot.isfree,
      active: slot.active,
      type: slot.type,
      desc: slot.desc,
      price: slot.price,
    });
  };

  const deleteSlot = (id) => {
    if (!window.confirm("Delete this slot?")) return;
    setSlots((prev) => prev.filter((s) => s.a_id !== id));
  };

  /* ================= SAVE TO BACKEND ================= */

  const saveToDatabase = async () => {
    // Backend should UPSERT by a_id
    await fetch("http://localhost:5000/api/teachers/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teacherId, slots }),
    });

    alert("Availability saved");
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-10">

      {/* HEADER */}
      <h2 className="text-2xl font-bold">Availability Settings</h2>

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl border space-y-4">

        <h3 className="font-semibold">
          {editingId ? "Edit Slot" : "Add Slot"}
        </h3>

        {/* WEEKLY / DATE */}
        <div className="flex gap-2">
          {["WEEKLY", "DATE"].map((k) => (
            <button
              key={k}
              onClick={() => setForm({ ...form, kind: k })}
              className={`px-4 py-2 rounded ${
                form.kind === k ? "bg-purple-600 text-white" : "bg-gray-200"
              }`}
            >
              {k}
            </button>
          ))}
        </div>

        {/* DAY / DATE INPUT */}
        {form.kind === "WEEKLY" ? (
          <select
            name="dayofweek"
            value={form.dayofweek}
            onChange={updateForm}
            className="border p-2 rounded w-full"
          >
            <option value={1}>Monday</option>
            <option value={2}>Tuesday</option>
            <option value={3}>Wednesday</option>
            <option value={4}>Thursday</option>
            <option value={5}>Friday</option>
            <option value={6}>Saturday</option>
            <option value={0}>Sunday</option>
          </select>
        ) : (
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={updateForm}
            className="border p-2 rounded w-full"
          />
        )}

        {/* TIME SELECT */}
        <div className="grid grid-cols-2 gap-4">
          <select
            name="startmin"
            value={form.startmin}
            onChange={(e) =>
              setForm({
                ...form,
                startmin: Number(e.target.value),
                endmin: Number(e.target.value) + 30,
              })
            }
            className="border p-2 rounded"
          >
            {TIME_OPTIONS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          <select
            name="endmin"
            value={form.endmin}
            onChange={(e) =>
              setForm({ ...form, endmin: Number(e.target.value) })
            }
            className="border p-2 rounded"
          >
            {TIME_OPTIONS.filter(
              (t) => t.value > form.startmin
            ).map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* TOGGLES */}
        <div className="flex gap-6">
          <label>
            <input
              type="checkbox"
              checked={form.isfree}
              onChange={() => toggle("isfree")}
            />{" "}
            Free
          </label>

          <label>
            <input
              type="checkbox"
              checked={form.active}
              onChange={() => toggle("active")}
            />{" "}
            Active
          </label>
        </div>

        <button
          onClick={saveSlot}
          className="bg-purple-600 text-white px-6 py-2 rounded"
        >
          {editingId ? "Update Slot" : "Add Slot"}
        </button>
      </div>

      {/* EXISTING SLOTS */}
      <div className="grid md:grid-cols-3 gap-4">
        {slots.map((s) => (
          <div key={s.a_id} className="border p-4 rounded">
            <p className="font-semibold">
              {s.desc}</p>
            <p className="font-semibold">
              {s.kind === "WEEKLY"
                ? `Day ${DAY_LABELS[s.dayOfWeek]}`
                : s.date}
            </p>
            <p className="text-sm text-gray-600">
              {s.startmin} → {s.endmin}
            </p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => editSlot(s)}
                className="text-sm bg-blue-100 px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => deleteSlot(s.a_id)}
                className="text-sm bg-red-100 px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SAVE */}
      <button
        onClick={saveToDatabase}
        className="bg-green-600 text-white px-6 py-3 rounded"
      >
        Save Availability
      </button>
    </div>
  );
}
