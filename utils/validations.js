const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const BadRequest = require('../errors/bad-request');

const signIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(30),
  }),
});

const signUp = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(30),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((value) => {
      if (!validator.isURL(value, { require_protocol: true })) {
        throw new BadRequest('Неверный формат URL адреса');
      }
      return value;
    }),
  }),
});

module.exports = {
  signIn,
  signUp,
};
