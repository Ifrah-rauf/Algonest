import { createClient } from "npm:@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing Supabase function environment variables");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

Deno.serve(async () => {
  const now = new Date().toISOString();

  const { data: expiredBookings, error: bookingError } = await supabase
    .from("booking")
    .select("booking_id")
    .eq("payment_status", "approved")
    .lte("expiry_date", now);

  if (bookingError) {
    console.error("Failed to load expired bookings:", bookingError);
    return Response.json({ success: false, error: bookingError.message }, { status: 500 });
  }

  const bookingIds = (expiredBookings || []).map((row) => row.booking_id);
  if (bookingIds.length) {
    const { error: studentError } = await supabase
      .from("student")
      .update({ active_booking_id: null })
      .in("active_booking_id", bookingIds);

    if (studentError) {
      console.error("Failed to clear expired active bookings:", studentError);
      return Response.json({ success: false, error: studentError.message }, { status: 500 });
    }
  }

  return Response.json({ success: true, expiredBookingIds: bookingIds });
});
