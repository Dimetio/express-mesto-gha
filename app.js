const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '62a867923a301ac83bbd62be',
  };

  next();
});

app.use(userRoutes);
app.use(cardRoutes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
