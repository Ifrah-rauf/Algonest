import { createContentService, listContentService } from "../services/contentService.js";

export async function getContent(req, res) {
  try {
    const data = await listContentService();
    return res.json({ success: true, data });
  } catch (err) {
    console.error("getContent error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch content",
    });
  }
}

export async function uploadContent(req, res) {
  try {
    const { name, file, uid } = req.body;

    if (!uid || !name || !file) {
      return res.status(400).json({
        success: false,
        message: "uid, name and file are required",
      });
    }

    const data = await createContentService({ name, file });

    return res.status(201).json({
      success: true,
      message: "Content uploaded successfully",
      data,
    });
  } catch (err) {
    console.error("uploadContent error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to upload content",
    });
  }
}
