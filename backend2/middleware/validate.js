export function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "validation_error",
        message: error.details[0].message
      });
    }
    next();
  };
}
