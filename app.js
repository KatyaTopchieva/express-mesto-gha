const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const cards = require('./routes/cards.js');
const users = require('./routes/users.js');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cards);
app.use(users);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true
});

// подключаем мидлвары, роуты и всё остальное...

app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${PORT}`)
});

  //обработка ошибок
app.use((err, req, res) => {
  const { statusCode = ERROR_SERVER, message } = err;
  const errorMessage = (statusCode === ERROR_SERVER) ? 'Ошибка на сервере' : message;
  res.status(statusCode).send({ message: errorMessage });
});
