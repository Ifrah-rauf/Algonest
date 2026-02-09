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

app.listen(PORT, '0.0.0.0', () => { 
  console.log(`Backend running at http://localhost:${PORT}`);
});