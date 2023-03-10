const express = require('express');
const mongoose = require('mongoose');
const { NotFoundError } = require('./utils/errors/not-found');

const pageNotFoundError = new NotFoundError('Запрашиваемая страница не найдена');

// creating app
const app = express();

// listening port 3000
const { PORT = 3000 } = process.env;

// connecting to the Mongo server
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6409c58de4a29423bdc63a75',
  };

  next();
});

// Users:
app.use('/users', require('./routes/users'));

// Cards
app.use('/cards', require('./routes/cards'));

app.all('*', (req, res) => res.status(pageNotFoundError.statusCode).send({ message: pageNotFoundError.message }));

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
