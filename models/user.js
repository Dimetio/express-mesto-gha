const mongoose = require('mongoose');
const validator = require('validator');

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
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      mesasge: 'Некорректный email',
    },
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
