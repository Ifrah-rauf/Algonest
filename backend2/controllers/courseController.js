
import * as courseService from "../services/courseService.js";

export async function getCourses(req, res) {
  try {
    res.json(await courseService.getCourses());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createCourse(req, res) {
  try {
    const course = await courseService.createCourse(req.body);
    res.json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getCourseLessons(req, res) {
  try {
    res.json(await courseService.getCourseLessons(req.params.courseId));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

