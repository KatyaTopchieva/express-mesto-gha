const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
  .then((user) => res.send({ data: user }))
  .catch((err) => {
    console.log(`Ошибка: ${err}`)
  });
};

module.exports.deleteCard = (req, res) => {
  const { id } = req.params;

  Card.findById(id)
    .then((card) => {
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
      return Card.findByIdAndRemove(id);
      }
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      console.log(`Ошибка: ${err}`)
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
  .then((card) => {
    res.send({ data: card });
  })
  .catch((err) => {
    console.log(`Ошибка: ${err}`)
  });
};

module.exports.deletelikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      res.status(STATUS_OK).send({ data: card });
    })
    .catch((err) => {
      console.log(`Ошибка: ${err}`)
    });
};