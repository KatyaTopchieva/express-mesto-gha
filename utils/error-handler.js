module.exports.isValidationError = (res, err) => {
  console.log(`Ошибка: ${err}`);
  const isValidationError = err.message.indexOf('validation') > -1 || err.message.indexOf('Validation') > -1;
  return (isValidationError || (err.statusCode && err.statusCode === 400));
};

module.exports.isCastError = (res, err) => {
  console.log(`Ошибка: ${err}`);
  return err.message.indexOf('Cast to ObjectId failed') > -1;
};
