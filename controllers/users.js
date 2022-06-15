const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../utils/error_code');
const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Ой! Что-то пошло не так, мы скоро поправим' }));
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.path === '_id') {
        res.status(BAD_REQUEST).send({ message: 'Неправильный id' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ой! Что-то пошло не так, мы скоро поправим' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Введенные данные не прошли валидацию' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ой! Что-то пошло не так, мы скоро поправим' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Введенные данные не прошли валидацию' });
      } else if (err.path === '_id') {
        res.status(BAD_REQUEST).send({ message: 'Неправильный id' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ой! Что-то пошло не так, мы скоро поправим' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Введенные данные не прошли валидацию' });
      } else if (err.path === '_id') {
        res.status(BAD_REQUEST).send({ message: 'Неправильный id' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ой! Что-то пошло не так, мы скоро поправим' });
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
