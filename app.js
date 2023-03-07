const express = require('express');
const mongoose = require('mongoose');

// creating app
const app = express();

// listening port 3000
const { PORT = 3000 } = process.env;

// connecting to the mongo server
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use('/users', require('./routes/users'));

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
