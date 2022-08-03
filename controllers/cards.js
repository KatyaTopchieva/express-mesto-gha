const Card = require('../models/card');
const NotFound = require('../errors/not-found');
const Forbidden = require('../errors/forbidden-error');
const BadRequest = require('../errors/bad-request');
const { isCastError, isValidationError } = require('../utils/error-handler');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (isValidationError(res, err)) {
        next(new BadRequest(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound('Такой карточки не существует!');
      }
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
        throw new Forbidden('Невозможно удалить данную карточку');
      }
      return Card.findByIdAndRemove(cardId);
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (isCastError(res, err)) {
        next(new BadRequest(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
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
      if (isCastError(res, err)) {
        next(new BadRequest(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.deletelikeCard = (req, res, next) => {
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
      if (isCastError(res, err)) {
        next(new BadRequest(err.message));
      } else {
        next(err);
      }
    });
};
