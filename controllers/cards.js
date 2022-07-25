const Card = require('../models/card');
const NotFound = require('../errors/not-found');
const BadRequest = require('../errors/bad-request');
const DefoultError = require('../errors/defoult-error');
const { checkLength } = require('../utils/validation');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      console.log(`Ошибка: ${err}`);
      throw new DefoultError(err.message);
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
try{
  checkLength(name, "Название");
  Card.create({ name, link, owner: req.user._id })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.log(`Ошибка: ${err}`);
      throw new BadRequest(err.message);
    });
}
catch(e){
  res.status(e.statusCode).send({ message: e.message });
}

};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound('Такой карточки не существует!');
      }
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
        throw new BadRequest('Невозможно удалить данную карточку');
      }
      return Card.findByIdAndRemove(cardId);
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      console.log(`Ошибка: ${err}`);
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
  .then((card) => {
    if (!card) {
      throw new NotFound('Такой карточки не существует!');
    }
    res.send({ data: card });
  })
  .catch((err) => {
    console.log(`Ошибка: ${err}`);
  });
};

module.exports.deletelikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .then((card) => {
    if (!card) {
      throw new NotFound('Такой карточки не существует!');
    }
    res.send({ data: card });
  })
  .catch((err) => {
    console.log(`Ошибка: ${err}`);
  });
};
