const BadRequest = require('../errors/bad-request');

module.exports.isValidationError = (res, err, next) => {
  console.log(`Ошибка: ${err}`);
  const isValidationError = err.message.indexOf('validation') > -1 || err.message.indexOf('Validation') > -1;
  if (isValidationError || (err.statusCode && err.statusCode === 400)) {
    next(new BadRequest(err.message));
  }
};

module.exports.isCastError = (res, err, next) => {
  console.log(`Ошибка: ${err}`);
  const isCastError = err.message.indexOf('Cast to ObjectId failed') > -1;
  if (isCastError) {
    next(new BadRequest(err.message));
  }
};

// module.exports.sendError = (res, err) => {
//   console.log(`Ошибка: ${err}`);
//   const isNotFound = err.message.indexOf('not found') > -1;
//   const isCastError = err.message.indexOf('Cast to ObjectId failed') > -1;
//   const isValidationError = err.message.indexOf('validation') > -1 || err.message.indexOf('Validation') > -1;
//   if (isNotFound || (err.statusCode && err.statusCode === 404)) {
//     this.sendServerMessage(res, 404, err.message);
//     return;
//   }
//   if (err.statusCode && err.statusCode === 403) {
//     this.sendServerMessage(res, 403, err.message);
//     return;
//   }
//   if (err.statusCode && err.statusCode === 409) {
//     this.sendServerMessage(res, 409, err.message);
//     return;
//   }

//   if (isCastError || isValidationError || (err.statusCode && err.statusCode === 400)) {
//     this.sendServerMessage(res, 400, err.message);
//     return;
//   }

//   this.sendServerMessage(res, 500, err.message);
// };
