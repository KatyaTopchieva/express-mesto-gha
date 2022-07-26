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
