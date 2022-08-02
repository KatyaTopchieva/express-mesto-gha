const BadRequest = require('../errors/bad-request');

module.exports.isValidationError = (res, err, next) => {
  console.log(`Ошибка: ${err}`);
  const isValidationError = err.message.indexOf('validation') > -1 || err.message.indexOf('Validation') > -1;
  if (isValidationError || (err.statusCode && err.statusCode === 400)) {
    next(new BadRequest(err.message));
  } else {
    next(err);
  }
};

module.exports.isCastError = (res, err, next) => {
  console.log(`Ошибка: ${err}`);
  const isCastError = err.message.indexOf('Cast to ObjectId failed') > -1;
  if (isCastError) {
    next(new BadRequest(err.message));
  } else {
    next(err);
  }
};
