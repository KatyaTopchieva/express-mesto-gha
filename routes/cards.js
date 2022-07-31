const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  deletelikeCard,
} = require('../controllers/cards');
const {
  createCardValidation,
  cardIdValidation,
} = require('../utils/validations');

router.get('/cards', getCards);
router.post('/cards', createCardValidation, createCard);
router.delete('/cards/:cardId', cardIdValidation, deleteCard);
router.put('/cards/:cardId/likes', cardIdValidation, likeCard);
router.delete('/cards/:cardId/likes', cardIdValidation, deletelikeCard);

module.exports = router;
