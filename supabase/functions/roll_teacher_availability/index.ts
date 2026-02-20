import { createClient } from "npm:@supabase/supabase-js";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (_req) => {
  // 1. Expire past DATE-based slots
  const now = new Date().toISOString(); // full timestamp for timestamptz
  const { error: expireError } = await supabase
    .from("availability")
    .update({ active: false })
    .lt("date", now)
    .eq("kind", "DATE");

  if (expireError) console.error("Expire error:", expireError);

  // 2. Roll forward WEEKLY slots by updating their date field
  const { data: weeklySlots, error: weeklyError } = await supabase
    .from("availability")
    .select("*")
    .eq("kind", "WEEKLY");

  if (weeklyError) console.error("Weekly fetch error:", weeklyError);

  if (weeklySlots) {
    for (const slot of weeklySlots) {
      if (slot.dayofweek !== null) {
      const nextDate = getNextDate(slot.dayofweek);

      const { error: updateError } = await supabase
        .from("availability")
        .update({ date: nextDate })
        .eq("a_id", slot.a_id); // use primary key a_id

      if (updateError) console.error("Update error:", updateError);
    }
  }
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});

// Helper: find next calendar date for a given day of week
function getNextDate(dayOfWeek: number): string {
  const now = new Date();
  const diff = (dayOfWeek + 7 - now.getDay()) % 7;
  now.setDate(now.getDate() + diff);
  return now.toISOString(); // full timestamp for timestamptz
}
