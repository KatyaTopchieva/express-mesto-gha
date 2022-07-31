const jwt = require('jsonwebtoken');
const { sendBadAuthMessage } = require('../utils/error-handler');

const extractBearerToken = (header) => header.replace('Bearer ', '');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return sendBadAuthMessage(res, 'Необходима авторизация');
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return sendBadAuthMessage(res, 'Ошибка авторизации');
  }

  req.user = payload;
  next();
};
