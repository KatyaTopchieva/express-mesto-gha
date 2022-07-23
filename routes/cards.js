const router = require('express').Router();

const { getCards, createCard, deleteCard, likeCard, deletelikeCard } = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', likeCard);
router.delete('cards/:id/likes', deletelikeCard);

module.exports = router;