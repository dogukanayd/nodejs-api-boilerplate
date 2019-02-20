const Joi = require('joi');

exports.register = Joi.object().keys({
  fullName: Joi.string().trim().min(5).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
});

exports.login = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
});
