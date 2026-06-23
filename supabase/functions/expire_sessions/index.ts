import { createClient } from "@supabase/supabase-js";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing Supabase function environment variables");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

Deno.serve(async () => {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("session")
    .update({ status: "ENDED_PENDING_UPLOAD" })
    .lte("end_time", now)
    .in("status", ["BOOKED", "LIVE"])
    .select("session_id");

  if (error) {
    console.error("Failed to expire sessions:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }

  return Response.json({
    success: true,
    updatedSessionIds: (data || []).map((row) => row.session_id),
  });
});
