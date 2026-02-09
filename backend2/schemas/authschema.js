import Joi from "joi";

const signupSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  mail: Joi.string().email().required()
});

const loginSchema = Joi.object({
  mail: Joi.string().email().required(),
  password: Joi.string().required()
});

const firebaseLoginSchema = Joi.object({
  mail: Joi.string().email().required(),
  uidFromFirebase: Joi.string().optional()
});

const saveUserSchema = Joi.object({
  uid: Joi.string().required(),
  mail: Joi.string().email().required(),
  username: Joi.string().min(3).required()
});


export {
  signupSchema,
  loginSchema,
  firebaseLoginSchema,
  saveUserSchema
};
