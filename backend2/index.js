import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import session from "express-session";
import authRoutes from "./routes/authroutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import dashboardRoutes from "./routes/dashboardroutes.js";
import bookingRoutes from "./routes/bookingroutes.js";
import zoomRoutes from "./routes/zoomRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import teacherDashboardRoutes from "./routes/teacherDashboardRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import { startSessionLifecycleScheduler, startSessionReminderScheduler } from "./services/sessionReminderScheduler.js";
import studentRoutes from "./routes/studentRoutes.js";
import meetingRoutes from "./routes/geminiAudioRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "6mb" }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 1000 * 60 * 60,
    httpOnly: true
  }
}));
app.use(cors({
  origin: process.env.CLIENT_URL ||"http://localhost:3000",
  credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/zoom", zoomRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/teachers", teacherDashboardRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use(
    "/api/meetings",
    meetingRoutes
);
startSessionReminderScheduler();
startSessionLifecycleScheduler();

app.listen(PORT, '0.0.0.0', () => { 
  console.log(`Backend running at http://localhost:${PORT}`);
});
