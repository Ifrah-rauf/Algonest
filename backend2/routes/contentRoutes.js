import express from "express";
import { getContent, uploadContent } from "../controllers/contentController.js";

const router = express.Router();

router.get("/", getContent);
router.post("/upload", uploadContent);

export default router;
