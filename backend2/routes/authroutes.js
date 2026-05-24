import express from "express";
import {
  signup,
  login,
  firebaseLogin,
  logout,
  saveUser,
  getUser,
  updateStudentProfile,
  updateStudentCourse
} from "../controllers/authcontroller.js";
import { validate } from "../middleware/validate.js";
import {
  signupSchema,
  loginSchema,
  firebaseLoginSchema,
  saveUserSchema
} from "../schemas/authschema.js";

const router = express.Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/firebase-login", validate(firebaseLoginSchema), firebaseLogin);
router.post("/logout", logout);
router.post("/save-user", validate(saveUserSchema), saveUser);
router.get("/user/:uid", getUser);
router.post("/update-student-profile", updateStudentProfile);
router.post("/update-student-course", updateStudentCourse);

export default router;
