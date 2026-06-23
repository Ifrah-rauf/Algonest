import { apiUrl } from "../config/api.js";
import { useState, useEffect, useCallback } from "react";
import { Clock, Plus, Trash2, ChevronDown, Calendar, ToggleLeft, ToggleRight, Info, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const BASE_URL = apiUrl("/api/availability");

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const SLOT_TYPES = [
  { value: "plan", label: "Plan Session" },
  { value: "session", label: "Free Consult" },
];

const GRANULARITIES = [
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "60 min" },
  { value: 90, label: "90 min" },
];

function getFriendlySaveError(errors = []) {
  const text = errors.join(" ").toLowerCase();
  if (
    text.includes("timeslot") ||
    text.includes("slotbooking") ||
    text.includes("foreign key constraint")
  ) {
    return "Some availability changes were saved. Booked sessions were kept at their original time.";
  }
  return "Some changes could not be saved. Please review your availability and try again.";
}

function minToTime(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  const displayH = h % 12 === 0 ? 12 : h % 12;
  return `${displayH}:${m.toString().padStart(2, "0")} ${ampm}`;
}

const TIME_OPTIONS = [];
for (let min = 6 * 60; min <= 23 * 60; min += 30) {
  TIME_OPTIONS.push({ value: min, label: minToTime(min) });
}

// Unique key — real slots use a_id, new unsaved slots use a temp id
function slotKey(slot) {
  return slot.a_id ?? slot._tempId;
}

function makeTempSlot(dayofweek = 1) {
  return {
    _tempId: `temp_${Date.now()}_${Math.random()}`,
    a_id: null,
    dayofweek,
    date: null,
    startmin: 9 * 60,
    endmin: 10 * 60,
    slotgranularity: 60,
    isfree: false,
    active: true,
    kind: null,
    type: "plan",
    desc: "",
    price: "",
  };
}

export function EditAvailability() {
  const { user } = useAuth();
  const uid = user?.uid;

  const [slots, setSlots] = useState([]);
  const [expandedKey, setExpandedKey] = useState(null);
  const [viewMode, setViewMode] = useState("week");

  // Loading states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Feedback
  const [saveStatus, setSaveStatus] = useState(null); // "success" | "partial" | "error"
  const [saveMessage, setSaveMessage] = useState("");
  const [fetchError, setFetchError] = useState(null);

  // ── Fetch on mount ────────────────────────────────────────
  const fetchSlots = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch(`${BASE_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      const normalised = json.data.map((s) => ({
        ...s,
        price: s.price != null ? String(s.price) : "",
        desc: s.desc ?? "",
      }));
      setSlots(normalised);
    } catch (err) {
      console.error("[fetchSlots]", err.message);
      setFetchError(err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    if (!uid) return;
    fetchSlots();
  }, [uid, fetchSlots]);

  // ── Add unsaved slot ──────────────────────────────────────
  function addSlot(dayofweek = 1) {
    const newSlot = makeTempSlot(dayofweek);
    setSlots((prev) => [...prev, newSlot]);
    setExpandedKey(slotKey(newSlot));
  }

  // ── Local field update (before save) ─────────────────────
  function updateSlot(key, field, value) {
    setSlots((prev) =>
      prev.map((s) => (slotKey(s) === key ? { ...s, [field]: value } : s))
    );
  }

  // ── Toggle active — API call for existing, local for new ──
  async function toggleActive(slot) {
    const key = slotKey(slot);
    if (!slot.a_id) {
      updateSlot(key, "active", !slot.active);
      return;
    }
    setTogglingId(slot.a_id);
    try {
      const res = await fetch(`${BASE_URL}/toggle/${slot.a_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setSlots((prev) =>
        prev.map((s) => (s.a_id === slot.a_id ? { ...s, active: json.data.active } : s))
      );
    } catch (err) {
      console.error("[toggleActive]", err.message);
    } finally {
      setTogglingId(null);
    }
  }

  // ── Delete — API call for existing, local for new ─────────
  async function removeSlot(slot) {
    const key = slotKey(slot);
    if (!slot.a_id) {
      setSlots((prev) => prev.filter((s) => slotKey(s) !== key));
      if (expandedKey === key) setExpandedKey(null);
      return;
    }
    setDeletingId(slot.a_id);
    try {
      const res = await fetch(`${BASE_URL}/delete/${slot.a_id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setSlots((prev) => prev.filter((s) => s.a_id !== slot.a_id));
      if (expandedKey === key) setExpandedKey(null);
    } catch (err) {
      console.error("[deleteSlot]", err.message);
      setSaveStatus("error");
      setSaveMessage(
        err.message?.includes("booked sessions")
          ? "This availability has booked sessions. Turn it inactive instead of deleting it."
          : "Could not delete this availability. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // ── Bulk save ─────────────────────────────────────────────
  async function handleSave() {
    setSaving(true);
    setSaveStatus(null);
    setSaveMessage("");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);
    try {
      console.debug("[EditAvailability] save request", {
        uid,
        slotCount: slots.length,
        newSlots: slots.filter((s) => !s.a_id).length,
        existingSlots: slots.filter((s) => s.a_id).length,
        slots,
      });
      const res = await fetch(`${BASE_URL}/bulk-save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, slots }),
        signal: controller.signal,
      });
      const json = await res.json();
      console.debug("[EditAvailability] save response", {
        status: res.status,
        ok: res.ok,
        body: json,
      });
      if (!json.success) throw new Error(json.message);

      const {
        inserted = [],
        updated = [],
        errors = [],
        notices = [],
        timeslotSync = {},
      } = json.data;

      setSlots((prev) => {
        let remaining = [...prev];
        if (inserted.length > 0) {
          const tempSlots = remaining.filter((s) => !s.a_id);
          inserted.forEach((dbSlot, i) => {
            const tempSlot = tempSlots[i];
            if (tempSlot) {
              remaining = remaining.map((s) =>
                slotKey(s) === slotKey(tempSlot)
                  ? { ...dbSlot, price: dbSlot.price != null ? String(dbSlot.price) : "", desc: dbSlot.desc ?? "" }
                  : s
              );
            }
          });
        }
        updated.forEach((dbSlot) => {
          remaining = remaining.map((s) =>
            s.a_id === dbSlot.a_id
              ? { ...dbSlot, price: dbSlot.price != null ? String(dbSlot.price) : "", desc: dbSlot.desc ?? "" }
              : s
          );
        });
        return remaining;
      });

      if (errors.length > 0) {
        console.warn("[EditAvailability] partial save errors", errors);
      }
      setSaveStatus(errors.length > 0 ? "partial" : "success");
      if (errors.length > 0) {
        setSaveMessage(getFriendlySaveError(errors));
      } else if (notices.length > 0) {
        const protectedCount = Number(timeslotSync.protectedCount || 0);
        setSaveMessage(
          protectedCount > 0
            ? `Saved. ${protectedCount} booked session${protectedCount === 1 ? "" : "s"} kept at the original time.`
            : notices.join(" ")
        );
      } else {
        setSaveMessage("Availability saved and bookable timeslots updated.");
      }
      fetchSlots({ silent: true });
    } catch (err) {
      console.error("[bulkSave]", err.message);
      setSaveStatus("error");
      setSaveMessage(getFriendlySaveError([err.message || ""]));
    } finally {
      clearTimeout(timeoutId);
      setSaving(false);
      setTimeout(() => {
        setSaveStatus(null);
        setSaveMessage("");
      }, 8000);
    }
  }

  const slotsByDay = DAYS.map((day, idx) => ({
    day,
    idx,
    slots: slots.filter((s) => s.dayofweek === idx),
  }));

  const saveLabel =
    saving ? "Saving..."
    : saveStatus === "success" ? "✓ Saved!"
    : saveStatus === "partial" ? "⚠ Partial Save"
    : saveStatus === "error" ? "✗ Failed"
    : "Save Changes";

  const saveBg =
    saving ? "bg-gray-300 text-gray-600 cursor-not-allowed"
    : saveStatus === "success" ? "bg-green-500 text-white"
    : saveStatus === "partial" ? "bg-orange-400 text-white"
    : saveStatus === "error" ? "bg-red-500 text-white"
    : "bg-yellow-400 hover:bg-yellow-500 text-gray-900";

  return (
    <div className="p-8 w-full min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Edit Availability</h2>
          <p className="text-gray-500 mt-1 text-sm">
            Set when students can book sessions with you. Each slot generates bookable time windows.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <button
              onClick={() => setViewMode("week")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === "week"
                  ? "bg-purple-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Week View
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === "list"
                  ? "bg-purple-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              List View
            </button>
          </div>
          <button
            onClick={() => addSlot()}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Plus size={16} />
            Add Slot
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm ${saveBg}`}
          >
            {saving && <Loader2 size={14} className="inline mr-1 animate-spin" />}
            {saveLabel}
          </button>
        </div>
      </div>

      {saveMessage && (
        <div
          className={`flex items-start gap-3 rounded-xl px-4 py-3 mb-4 text-sm border ${
            saveStatus === "error"
              ? "bg-red-50 border-red-100 text-red-700"
              : saveStatus === "partial"
                ? "bg-orange-50 border-orange-100 text-orange-700"
                : "bg-emerald-50 border-emerald-100 text-emerald-700"
          }`}
        >
          {saveStatus === "error" || saveStatus === "partial" ? (
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
          ) : (
            <Info size={16} className="mt-0.5 shrink-0" />
          )}
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-purple-50 border border-purple-100 rounded-xl px-4 py-3 mb-6">
        <Info size={16} className="text-purple-500 mt-0.5 shrink-0" />
        <p className="text-sm text-purple-700">
          Slots define your availability windows. The <strong>slot granularity</strong> controls how long each bookable session is within that window. Toggle or delete existing slots instantly — new slots save when you click <strong>Save Changes</strong>.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-24 text-gray-400">
          <Loader2 size={28} className="animate-spin mr-3 text-purple-400" />
          <span className="text-sm">Loading your availability...</span>
        </div>
      )}

      {/* Fetch error */}
      {!loading && fetchError && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-4 text-red-600 text-sm">
          <AlertCircle size={16} className="shrink-0" />
          <span>{fetchError}</span>
          <button onClick={fetchSlots} className="ml-auto underline text-red-500 hover:text-red-700">
            Retry
          </button>
        </div>
      )}

      {/* Main content */}
      {!loading && !fetchError && (
        viewMode === "week" ? (
          /* ── WEEK VIEW ── */
          <div className="grid grid-cols-1 gap-4">
            {slotsByDay.map(({ day, idx, slots: daySlots }) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Day header */}
                <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Calendar size={15} className="text-purple-500" />
                    <span className="font-semibold text-gray-800 text-sm">{day}</span>
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-medium">
                      {daySlots.length} slot{daySlots.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <button
                    onClick={() => addSlot(idx)}
                    className="text-xs text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1"
                  >
                    <Plus size={12} /> Add
                  </button>
                </div>

                {daySlots.length === 0 ? (
                  <div className="px-5 py-4 text-sm text-gray-400 italic">No availability set for {day}</div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {daySlots.map((slot) => (
                      <SlotCard
                        key={slotKey(slot)}
                        slot={slot}
                        expanded={expandedKey === slotKey(slot)}
                        onToggleExpand={() =>
                          setExpandedKey(expandedKey === slotKey(slot) ? null : slotKey(slot))
                        }
                        onUpdate={updateSlot}
                        onRemove={removeSlot}
                        onToggleActive={toggleActive}
                        isToggling={togglingId === slot.a_id}
                        isDeleting={deletingId === slot.a_id}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* ── LIST VIEW ── */
          <div className="space-y-3">
            {slots.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <Clock size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No availability slots yet. Click "Add Slot" to begin.</p>
              </div>
            )}
            {slots.map((slot) => (
              <SlotCard
                key={slotKey(slot)}
                slot={slot}
                expanded={expandedKey === slotKey(slot)}
                onToggleExpand={() =>
                  setExpandedKey(expandedKey === slotKey(slot) ? null : slotKey(slot))
                }
                onUpdate={updateSlot}
                onRemove={removeSlot}
                onToggleActive={toggleActive}
                isToggling={togglingId === slot.a_id}
                isDeleting={deletingId === slot.a_id}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}

/* ─── Slot Card ─────────────────────────────────────────── */
function SlotCard({ slot, expanded, onToggleExpand, onUpdate, onRemove, onToggleActive, isToggling, isDeleting }) {
  const key = slotKey(slot);
  const duration = slot.endmin - slot.startmin;
  const sessionCount = duration > 0 ? Math.floor(duration / slot.slotgranularity) : 0;
  const isNew = !slot.a_id;

  return (
    <div className={`transition-all ${!slot.active ? "opacity-50" : ""}`}>
      {/* Collapsed header */}
      <div
        className="flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-3 flex-wrap">

          {/* Unsaved badge */}
          {isNew && (
            <span className="text-xs bg-blue-100 text-blue-600 font-semibold px-2 py-0.5 rounded-full">
              Unsaved
            </span>
          )}

          {/* Time range pill */}
          <span className="flex items-center gap-1.5 bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-purple-100">
            <Clock size={11} />
            {minToTime(slot.startmin)} – {minToTime(slot.endmin)}
          </span>

          {/* Type badge */}
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            slot.type === "session" || slot.type === "free"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}>
            {slot.type === "session" || slot.type === "free" ? "Free Consult" : "Plan Session"}
          </span>

          {/* Session count */}
          <span className="text-xs text-gray-500">
            {sessionCount} × {slot.slotgranularity}min session{sessionCount !== 1 ? "s" : ""}
          </span>

          {/* Active toggle */}
          <button
            onClick={(e) => { e.stopPropagation(); onToggleActive(slot); }}
            disabled={isToggling}
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full transition-colors ${
              isToggling
                ? "bg-gray-100 text-gray-400 cursor-wait"
                : slot.active
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {isToggling
              ? <Loader2 size={12} className="animate-spin" />
              : slot.active
              ? <><ToggleRight size={13} /> Active</>
              : <><ToggleLeft size={13} /> Inactive</>
            }
          </button>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(slot); }}
            disabled={isDeleting}
            className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:cursor-wait"
          >
            {isDeleting
              ? <Loader2 size={14} className="animate-spin text-red-400" />
              : <Trash2 size={14} />
            }
          </button>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* Expanded editor */}
      {expanded && (
        <div className="px-5 pb-5 pt-1 bg-gray-50 border-t border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">

            {/* Day of Week */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Day of Week
              </label>
              <select
                value={slot.dayofweek}
                onChange={(e) => onUpdate(key, "dayofweek", Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                {DAYS.map((d, i) => (
                  <option key={i} value={i}>{d}</option>
                ))}
              </select>
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Start Time
              </label>
              <select
                value={slot.startmin}
                onChange={(e) => onUpdate(key, "startmin", Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* End Time */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                End Time
              </label>
              <select
                value={slot.endmin}
                onChange={(e) => onUpdate(key, "endmin", Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                {TIME_OPTIONS.filter((t) => t.value > slot.startmin).map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Slot Granularity */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Session Duration
              </label>
              <div className="flex gap-2 flex-wrap">
                {GRANULARITIES.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => onUpdate(key, "slotgranularity", g.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      slot.slotgranularity === g.value
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Session Type
              </label>
              <div className="flex gap-2">
                {SLOT_TYPES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => {
                      onUpdate(key, "type", t.value);
                      onUpdate(key, "isfree", t.value === "session");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      slot.type === t.value
                        ? "bg-yellow-400 text-gray-900 border-yellow-400"
                        : "bg-white text-gray-600 border-gray-200 hover:border-yellow-300"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price (only if not free) */}
            {!slot.isfree && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 999"
                  value={slot.price}
                  onChange={(e) => onUpdate(key, "price", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>
            )}

            {/* Description */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Description <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. MERN checkpoint review, Backend doubt session..."
                value={slot.desc}
                onChange={(e) => onUpdate(key, "desc", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
          </div>

          {/* Preview bar */}
          <div className="mt-4 flex items-center gap-3 bg-white border border-purple-100 rounded-xl px-4 py-3">
            <div className="w-2 h-2 rounded-full bg-purple-400 shrink-0"></div>
            <p className="text-xs text-gray-600">
              This slot generates{" "}
              <strong className="text-purple-700">{sessionCount} bookable session{sessionCount !== 1 ? "s" : ""}</strong>{" "}
              of <strong className="text-purple-700">{slot.slotgranularity} minutes</strong> each, on{" "}
              <strong className="text-gray-800">{DAYS[slot.dayofweek]}</strong> from{" "}
              <strong className="text-gray-800">{minToTime(slot.startmin)}</strong> to{" "}
              <strong className="text-gray-800">{minToTime(slot.endmin)}</strong>.
              {isNew && <span className="ml-2 text-blue-500 font-medium">Click Save Changes to persist.</span>}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
