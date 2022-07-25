const BadRequest = require('../errors/bad-request');

module.exports.checkLength = (value, fieldName) => {
  if (!value || value.length < 2) {
    throw new BadRequest(fieldName + ' должно содержать не менее 2 символов');
  }
  if (value.length > 30) {
    throw new BadRequest(fieldName + ' должно содержать не более 30 символов');
  }
};

module.exports.checkLink = (value, fieldName) => {
  if (!value) {
    throw new BadRequest(fieldName + ' является обязательной для заполнения');
  }
};
