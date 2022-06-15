const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Введите имя'],
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: [true, 'Напишите о себе'],
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: [true, 'Без картинки никуда'],
  },
});

module.exports = mongoose.model('user', userSchema);
