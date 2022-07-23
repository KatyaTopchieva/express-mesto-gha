const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserId = (req, res) => {
  User.findById(req.user._id).select('+password')
    .then((user) => {
      res.send({ data: user });
    })
    .catch(() => res.send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar,
  } = req.body;

  User.findOne({ name })
  .then((user) => {
    if (user) {
      throw new Error('Такой пользователь уже существует!');
    }
  })
    .then(() => User.create({
      name, about, avatar
    }))
    .then((user) => res.send({ _id: user._id, email: user.email }))
    .catch(() => res.send({ message: 'Произошла ошибка' }));
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about })
  .then((user) => {
    res.send({ data: user });
  })
  .catch((err) => {
    console.log(`Ошибка: ${err}`)
  });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
  .then((user) => {
    res.send({ data: user });
  })
  .catch((err) => {
    console.log(`Ошибка: ${err}`)
  });
};