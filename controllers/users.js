const User = require('../models/user');
const NotFound = require('../errors/not-found');
const BadRequest = require('../errors/bad-request');
const DefoultError = require('../errors/defoult-error');
const { checkLength, checkLink } = require('../utils/validation');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch((err) => {
      console.log(`Ошибка: ${err}`);
      throw new DefoultError(err.message);
    });
};

module.exports.getUserId = (req, res) => {
  try{
    if(req.params.userId.length !== 24) {
      throw new BadRequest('Некорректный id');
    }
    User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((e) => res.status(e.statusCode).send({ message: e.message }));
  }
  catch(e){
    res.status(e.statusCode).send({ message: e.message });
  }

};

module.exports.createUser = (req, res) => {
  const name = req.body.name??'';
  const about = req.body.about??'';
  const avatar = req.body.avatar??'';

  try{
    checkLength(name, "Имя");
    checkLength(about, "Описание");
    checkLink(avatar, "Ссылка");

    User.findOne({ name })
    .then((user) => {
      if (user) {
        throw new NotFound('Такой пользователь уже существует!');
      }
    })
      .then(() => User.create({
        name, about, avatar,
      }))
      .then((user) => res.send({id: user._id, name: user.name, about: user.about, avatar: user.avatar}))
      .catch((e) => res.status(e.statusCode).send({ message: e.message }));
  }
  catch(e){
    res.status(e.statusCode).send({ message: e.message });
  }
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  try{
    checkLength(name, "Имя");
    checkLength(about, "Описание");
    User.findByIdAndUpdate(req.user._id, { name, about }, {
      new: true,
      runValidators: true,
      upsert: true,
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      console.log(`Ошибка: ${err}`);
      throw new BadRequest(err.message);
    });
  }
  catch(e){
    res.status(e.statusCode).send({ message: e.message });
  }
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar },
    {
        new: true,
        runValidators: true,
        upsert: true,
    })
  .then((user) => {
    res.send({ data: user });
  })
  .catch((err) => {
    console.log(`Ошибка: ${err}`);
    throw new BadRequest(err.message);
  });
};
