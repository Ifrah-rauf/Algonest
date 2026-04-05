import { createClient } from "jsr:@supabase/supabase-js@2";


const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (_req) => {
  const now = new Date().toISOString();

  // Expire sessions whose end_time has passed
  const { error } = await supabase
    .from("sessions") // adjust table name if needed
    .update({ status: "EXPIRED" })
    .lt("end_time", now)
    .eq("status", "ACTIVE"); // only expire active ones

  if (error) console.error("Expire error:", error);

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});
