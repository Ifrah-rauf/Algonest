import Joi from "joi";

const strongPassword = Joi.string()
  .min(8)
  .pattern(/[A-Z]/, "uppercase letter")
  .pattern(/[a-z]/, "lowercase letter")
  .pattern(/\d/, "number")
  .pattern(/[^A-Za-z0-9]/, "special character")
  .required()
  .messages({
    "string.min": "Password must be at least 8 characters long",
    "string.pattern.name": "Password must include at least one {#name}",
  });

const signupSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: strongPassword,
  mail: Joi.string().email().required(),
  role: Joi.string().valid("STUDENT", "TEACHER", "ADMIN").default("STUDENT")
});

const loginSchema = Joi.object({
  mail: Joi.string().email().required(),
  password: Joi.string().required()
});

const firebaseLoginSchema = Joi.object({
  mail: Joi.string().email().required(),
  uidFromFirebase: Joi.string().optional(),
  username: Joi.string().min(2).max(50).optional(),
  role: Joi.string().valid("STUDENT", "TEACHER", "ADMIN").default("STUDENT")
});

const saveUserSchema = Joi.object({
  uid: Joi.string().required(),
  mail: Joi.string().email().required(),
  username: Joi.string().min(2).max(50).required(),
  role: Joi.string().valid("STUDENT", "TEACHER", "ADMIN").default("STUDENT")
});


export {
  signupSchema,
  loginSchema,
  firebaseLoginSchema,
  saveUserSchema
};
