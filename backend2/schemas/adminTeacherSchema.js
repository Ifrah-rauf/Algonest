import Joi from "joi";

const adminTeacherCreateSchema = Joi.object({
  requesterUid: Joi.string().required(),
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).optional().allow(""),
  bio: Joi.string().allow("").optional(),
  education: Joi.string().allow("").optional(),
  teaching_style: Joi.string().allow("").optional(),
  rating: Joi.number().min(0).max(5).optional(),
  video_url: Joi.string().allow("").optional(),
  pfp: Joi.string().allow("").optional(),
  timezone: Joi.string().allow("").optional(),
  verified: Joi.boolean().optional(),
  experience: Joi.string().allow("").optional(),
  meeting_link: Joi.string().allow("").optional(),
});

const adminTeacherUpdateSchema = Joi.object({
  requesterUid: Joi.string().required(),
  name: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional().allow(""),
  bio: Joi.string().allow("").optional(),
  education: Joi.string().allow("").optional(),
  teaching_style: Joi.string().allow("").optional(),
  rating: Joi.number().min(0).max(5).optional(),
  video_url: Joi.string().allow("").optional(),
  pfp: Joi.string().allow("").optional(),
  timezone: Joi.string().allow("").optional(),
  verified: Joi.boolean().optional(),
  experience: Joi.string().allow("").optional(),
  meeting_link: Joi.string().allow("").optional(),
});

const adminTeacherRequesterSchema = Joi.object({
  requesterUid: Joi.string().required(),
});

export {
  adminTeacherCreateSchema,
  adminTeacherUpdateSchema,
  adminTeacherRequesterSchema,
};
