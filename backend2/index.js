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
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json()); // parse JSON bodies
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 1000 * 60 * 60, // 1 hour
    httpOnly: true
  }
}));
app.use(cors({
  origin: process.env.CLIENT_URL ||"http://localhost:3000", // <-- React app URL
  credentials: true               // <-- allow cookies/session to be sent
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

app.listen(PORT, '0.0.0.0', () => { 
  console.log(`Backend running at http://localhost:${PORT}`);
});
