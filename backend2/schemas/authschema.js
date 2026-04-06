import Joi from "joi";

const signupSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  mail: Joi.string().email().required(),
  role: Joi.string().valid("STUDENT", "TEACHER").default("STUDENT")
});

const loginSchema = Joi.object({
  mail: Joi.string().email().required(),
  password: Joi.string().required()
});

const firebaseLoginSchema = Joi.object({
  mail: Joi.string().email().required(),
  uidFromFirebase: Joi.string().optional(),
  username: Joi.string().min(2).max(50).optional(),
  role: Joi.string().valid("STUDENT", "TEACHER").default("STUDENT")
});

const saveUserSchema = Joi.object({
  uid: Joi.string().required(),
  mail: Joi.string().email().required(),
  username: Joi.string().min(2).max(50).required(),
  role: Joi.string().valid("STUDENT", "TEACHER").default("STUDENT")
});


export {
  signupSchema,
  loginSchema,
  firebaseLoginSchema,
  saveUserSchema
};
