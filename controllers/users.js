const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id).select('+password')
    .then((user) => {
      res.send({ data: user });
    })
    .catch(() => res.send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  User.findOne({ email })
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => res.send({ _id: user._id, email: user.email }))
    .catch(() => res.send({ message: 'Произошла ошибка' }));
};