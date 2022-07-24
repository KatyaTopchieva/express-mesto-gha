const User = require('../models/user');
const NotFound = require('../errors/not-found');
const BadRequest = require('../errors/bad-request');
const DefoultError = require('../errors/defoult-error');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch((err) => {
      console.log(`Ошибка: ${err}`);
      throw new DefoultError(err.message);
    });
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch(() => res.send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
const name = req.body.name??'';
const about = req.body.about??'';
const avatar = req.body.avatar;

const checkLength = (value, fieldName) => {
  if (!value || value.length < 2) {
    throw new BadRequest(fieldName + ' должно содержать не менее 2 символов');
  }
  if (value.length > 30) {
    throw new BadRequest(fieldName + ' должно содержать не более 30 символов');
  }
}

User.findOne({ name })
  .then((user) => {
    if (user) {
      throw new NotFound('Такой пользователь уже существует!');
    }
    checkLength(name, "Имя");
    checkLength(about, "Описание");
  })
    .then(() => User.create({
      name, about, avatar,
    }))
    .then((user) => res.send({id: user._id, name: user.name, about: user.about, avatar: user.avatar}))
    .catch((e) => res.status(e.statusCode).send({ message: e.message }));
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about })
  .then((user) => {
    res.send({ data: user });
  })
  .catch((err) => {
    console.log(`Ошибка: ${err}`);
    throw new BadRequest(err.message);
  });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
  .then((user) => {
    res.send({ data: user });
  })
  .catch((err) => {
    console.log(`Ошибка: ${err}`);
    throw new BadRequest(err.message);
  });
};
