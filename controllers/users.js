const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFound = require('../errors/not-found');
const BadRequest = require('../errors/bad-request');
const ConflictError = require('../errors/conflict-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const { isCastError, isValidationError } = require('../utils/error-handler');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден');
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (isCastError(res, err)) {
        next(new BadRequest(err.message));
      } else {
        next(err);
      }
    });
};

const getSipleUser = (user) => ({
  data:
      {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
        email: user.email,
      },
});

module.exports.createUser = (req, res, next) => {
  const { email } = req.body;
  User.findOne({ email }).then((user) => {
    if (user) {
      throw new ConflictError(`Пользователь с ${email} уже существует.`);
    }
    return bcrypt.hash(req.body.password, 10);
  })
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.status(201).send(getSipleUser(user)))
    .catch((err) => {
      if (isValidationError(res, err)) {
        next(new BadRequest(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден');
      }
      res.send(getSipleUser(user));
    })
    .catch((err) => {
      if (isValidationError(res, err)) {
        next(new BadRequest(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (isValidationError(res, err)) {
        next(new BadRequest(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequest('Переданы некорректные данные');
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => next(new UnauthorizedError('Неправильные почта или пароль')));
};

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id).then((user) => {
    if (!user) {
      return next(new NotFound('Пользователь не найден.'));
    }

    return res.status(200).send(user);
  }).catch(next);
};
