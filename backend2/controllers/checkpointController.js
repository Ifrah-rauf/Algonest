
import * as checkpointService from "../services/checkpointService.js";

export async function getCheckpoints(req, res) {
  try {
    const { studentId } = req.params;
    const checkpoints = await checkpointService.listCheckpoints(studentId);
    res.json(checkpoints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function completeCheckpoint(req, res) {
  try {
    const { checkpointId } = req.params;
    const { studentId } = req.body;
    const checkpoint = await checkpointService.completeCheckpoint(checkpointId, studentId);
    if (!checkpoint) {
      return res.status(404).json({ error: "Checkpoint not found or not updated" });
    }
    res.json({ message: "Checkpoint completed", checkpoint });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
