const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cards = require('./routes/cards');
const users = require('./routes/users');
const pathNotFound = require('./routes/not-found');
const { createUser, login } = require('./controllers/users');
const { signUp, signIn } = require('./utils/validations');
const auth = require('./middlewares/auth');
const mainErrorHandler = require('./middlewares/main-error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/signin', signIn, login);
app.post('/signup', signUp, createUser);
app.use(auth);

app.use(cards);
app.use(users);
app.use(pathNotFound);

app.use(errorLogger);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(errors());
app.use(mainErrorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
