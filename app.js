const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cards = require('./routes/cards');
const users = require('./routes/users');
const pathNotFound = require('./routes/not-found');
const { createUser, login } = require('./controllers/users');
const { signUp, signIn } = require('./utils/validations');
const auth = require('./middlewares/auth');
const { errors } = require('celebrate');
const mainErrorHandler = require('./middlewares/main-error-handler');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', signIn, login);
app.post('/signup', signUp, createUser);
app.use(auth);

app.use(cards);
app.use(users);
app.use(pathNotFound);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(errors());
app.use(mainErrorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
