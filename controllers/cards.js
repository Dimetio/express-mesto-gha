const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  FORBIDDEN_ERROR,
} = require('../utils/error_code');
const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Ой! Что-то пошло не так, мы скоро поправим' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Введенные данные не прошли валидацию' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ой! Что-то пошло не так, мы скоро поправим' });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findById(req.params._id)
    .then((card) => {
      if (card.owner !== req.user._id) {
        res.status(FORBIDDEN_ERROR).send({ message: 'Недостаточно прав' });
        return;
      }

      Card.findByIdAndRemove(req.params.cardId)
        .then((cardData) => {
          if (!cardData) {
            res.status(NOT_FOUND).send({ message: 'Место не найдено' });
            return;
          }
          res.send({ data: cardData });
        })
        .catch((err) => {
          if (err.path === '_id') {
            res.status(BAD_REQUEST).send({ message: 'Неправильный id' });
          } else {
            res.status(SERVER_ERROR).send({ message: 'Ой! Что-то пошло не так, мы скоро поправим' });
          }
        });
    })
    .catch();
};

const addLike = (req, res) => {
  const owner = req.user._id;

  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: owner } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Место не найдено' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.path === '_id') {
        res.status(BAD_REQUEST).send({ message: 'Неправильный id' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ой! Что-то пошло не так, мы скоро поправим' });
      }
    });
};

const removeLike = (req, res) => {
  const owner = req.user._id;

  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: owner } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Место не найдено' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.path === '_id') {
        res.status(BAD_REQUEST).send({ message: 'Неправильный id' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ой! Что-то пошло не так, мы скоро поправим' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
};
