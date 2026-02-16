// routes/zoomRoutes.js
import express from "express";
import { getToken, createMeeting,zoomWebhookHandler } from "../controllers/zoomController.js";

const router = express.Router();

router.get("/getToken", getToken);
// router.post("/webhook", (req, res) => {
//   console.log("Headers:", req.headers);
//   console.log("Body:", req.body);
//   res.status(200).json({ received: true });
// });



router.post("/createMeeting", createMeeting);
router.post("/webhook", zoomWebhookHandler);


export default router;
