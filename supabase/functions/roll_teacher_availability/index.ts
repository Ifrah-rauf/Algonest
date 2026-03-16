import { createClient } from "npm:@supabase/supabase-js";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (_req) => {
  const now = new Date().toISOString();

  // 1. Expire past DATE-based availabilities
  const { error: expireError } = await supabase
    .from("availability")
    .update({ active: false })
    .lt("date", now)
    .eq("kind", "DATE");
  if (expireError) console.error("Expire error:", expireError);

  // 2. Roll forward WEEKLY availabilities
  const { data: weeklySlots, error: weeklyError } = await supabase
    .from("availability")
    .select("*")
    .eq("kind", "WEEKLY");
  if (weeklyError) console.error("Weekly fetch error:", weeklyError);

  if (weeklySlots) {
    for (const slot of weeklySlots) {
      if (slot.dayofweek !== null) {
        const nextDate = getNextDate(slot.dayofweek);

        // Update availability date
        const { error: updateError } = await supabase
          .from("availability")
          .update({ date: nextDate })
          .eq("a_id", slot.a_id);
        if (updateError) console.error("Availability update error:", updateError);

        // Rebuild all timeslots for this availability
        const { data: timeslots, error: tsError } = await supabase
          .from("timeslot")
          .select("*")
          .eq("availabilityid", slot.a_id);
        if (tsError) console.error("Timeslot fetch error:", tsError);

        if (timeslots) {
          // Calculate number of slots based on startmin/endmin and granularity
          const totalMinutes = slot.endmin - slot.startmin;
          const numSlots = Math.floor(totalMinutes / slot.slotgranularity);

          for (let i = 0; i < numSlots; i++) {
            const ts = timeslots[i];
            if (!ts) continue; // skip if fewer rows exist

            const start = new Date(nextDate);
            start.setMinutes(slot.startmin + i * slot.slotgranularity);

            const end = new Date(start);
            end.setMinutes(start.getMinutes() + ts.durationmin);

            const { error: tsUpdateError } = await supabase
              .from("timeslot")
              .update({
                startat: start.toISOString(),
                endat: end.toISOString(),
                isbooked: false,
              })
              .eq("slot_id", ts.slot_id);

            if (tsUpdateError) console.error("Timeslot update error:", tsUpdateError);
          }
        }
      }
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});

// Helper: find next calendar date for a given day of week
function getNextDate(dayOfWeek: number): string {
  const now = new Date();
  const diff = (dayOfWeek + 7 - now.getDay()) % 7;
  now.setDate(now.getDate() + diff);
  return now.toISOString();
}
