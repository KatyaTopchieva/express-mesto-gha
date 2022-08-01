const router = require('express').Router();
const NotFound = require('../errors/not-found');

router.all('*', () => {
  throw new NotFound('Ресурс не найден');
});

module.exports = router;
