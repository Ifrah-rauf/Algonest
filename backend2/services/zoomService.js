// services/zoomService.js
import axios from "axios";
import { supabase } from "../lib/supabase.js";

/**
 * Generate Zoom OAuth Access Token
 */
export async function getZoomAccessToken() {
  const response = await axios.post(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
    {},
    {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
          ).toString("base64"),
      },
    }
  );

  return response.data.access_token;
}

/**
 * Create Zoom Meeting (Single Source of Truth)
 */
export async function createZoomMeeting({
  topic,
  startTime,
  duration,
  timezone = "UTC",
  waitingRoom = true,
  joinBeforeHost = false,
  hostEmail = null,
  alternativeHost = null,
}) {
  console.log("params", topic, startTime, duration);
  if (!topic || !startTime || !duration) {
    throw new Error("Missing required Zoom meeting parameters");
  }

  const token = await getZoomAccessToken();

  const url = hostEmail
    ? `https://api.zoom.us/v2/users/${encodeURIComponent(hostEmail)}/meetings`
    : "https://api.zoom.us/v2/users/me/meetings";

  const payload = {
    topic,
    type: 2,
    start_time: startTime,
    duration,
    timezone,
    settings: {
      waiting_room: waitingRoom,
      join_before_host: joinBeforeHost,
      participant_video: true,
      host_video: true,
      mute_upon_entry: false,
      approval_type: 0,
    },
  };

  if (alternativeHost) {
    payload.settings.alternative_hosts = alternativeHost;
  }

  const response = await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}


/**
 * Delete Zoom Meeting (Rollback protection)
 */
async function deleteZoomMeeting(meetingId) {
  const token = await getZoomAccessToken();

  await axios.delete(
    `https://api.zoom.us/v2/meetings/${meetingId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

/**
 * Final Orchestration Layer
 * Creates Zoom meeting + inserts into session table
 */
export async function createSessionWithZoom(data) {
  const { booking_id, t_id, startTime, title, duration = 30 } = data;

  if (!booking_id || !t_id || !startTime) {
    throw new Error("Missing required fields");
  }

  // 1️⃣ Lookup teacher email and create Zoom Meeting under teacher's Zoom user when possible
  let teacherEmail = null;
  try {
    const { data: teacherRow, error: tErr } = await supabase
      .from("teacher")
      .select("uid")
      .eq("t_id", t_id)
      .maybeSingle();

    if (!tErr && teacherRow?.uid) {
      const { data: authRow, error: aErr } = await supabase
        .from("auth")
        .select("email")
        .eq("uid", teacherRow.uid)
        .maybeSingle();
      if (!aErr && authRow?.email) teacherEmail = authRow.email;
    }
  } catch (e) {
    // ignore and fall back to service account
    teacherEmail = null;
  }

  const meeting = await createZoomMeeting({
    topic: title || "AlgoNest Session",
    startTime,
    duration,
    hostEmail: teacherEmail,
    // keep service account as alternative host so system can manage meeting if needed
    alternativeHost: process.env.SENDER_MAIL || null,
  });

  try {
    // 2️⃣ Insert Into Database
    const { data: sessionData, error } = await supabase
      .from("session")
      .insert([
        {
          booking_id,
          t_id,
          zoom_meeting_id: meeting.id,
          session_link: meeting.join_url,
          join_url: meeting.join_url,
          start_url: meeting.start_url,
          start_time: startTime,
          duration,
          title: title || "AlgoNest Session",
          status: "BOOKED",
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    return sessionData[0];

  } catch (dbError) {
    // 🔥 Rollback: Delete Zoom meeting if DB fails
    await deleteZoomMeeting(meeting.id);
    throw dbError;
  }
}
