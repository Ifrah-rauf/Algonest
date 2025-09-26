// backend/index.js
import express from "express";
import cors from "cors";
import session from "express-session";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json()); // parse JSON bodies
app.use(session({
  secret: "mysecret",
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 1000 * 60 * 60, // 1 hour
    httpOnly: true
  }
}));
app.use(cors({
  origin: "http://localhost:3000", // <-- React app URL
  credentials: true               // <-- allow cookies/session to be sent
}));

// Example API route
// app.get('/api/message', (req, res) => {
//   res.json({ message: 'Hello from Algonest backend!' });
// });
app.use("/api", authRoutes);
// Start server
app.listen(PORT, '0.0.0.0', () => {  // <- IMPORTANT, binds to all interfaces
  console.log(`Backend running at http://localhost:${PORT}`);
});