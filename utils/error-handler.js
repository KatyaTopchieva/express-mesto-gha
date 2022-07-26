module.exports.sendServerMessage = (res, statusCode, message) => {
  res.status(statusCode).send({ message });
};

module.exports.sendBadMessage = (res, message) => {
  this.sendServerMessage(res, 400, message);
};

module.exports.sendNodFoundMessage = (res, message) => {
  this.sendServerMessage(res, 404, message);
};

module.exports.sendDefaultMessage = (res, message) => {
  this.sendServerMessage(res, 500, message);
};

module.exports.sendError = (res, err) => {
  console.log(`Ошибка: ${err}`);
  const isNotFound = err.message.indexOf('not found') > -1;
  const isCastError = err.message.indexOf('Cast to ObjectId failed') > -1;
  const isValidationError = err.message.indexOf('ValidationError') > -1;
  if (isNotFound || (err.statusCode && err.statusCode === 404)) {
    this.sendServerMessage(res, 404, err.message);
    return;
  }

  if (isCastError || isValidationError || (err.statusCode && err.statusCode === 400)) {
    this.sendServerMessage(res, 400, err.message);
    return;
  }

  this.sendServerMessage(res, 500, err.message);
};
