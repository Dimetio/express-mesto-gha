const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const CastError = require('../errors/CastError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const BadRequest = require('../errors/BadRequest');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((next));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Введенные данные не прошли валидацию'));
      }

      next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params._id)
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new UnauthorizedError('Недостаточно прав');
      }

      Card.findByIdAndRemove(req.params.cardId)
        .then((cardData) => {
          if (!cardData) {
            throw new NotFoundError('Место не найдено');
          }
          res.send({ data: cardData });
        })
        .catch((err) => {
          if (err.path === '_id') {
            next(new BadRequest('Введенные данные не прошли валидацию'));
          }

          next(err);
        });
    })
    .catch(next);
};

const addLike = (req, res, next) => {
  const owner = req.user._id;

  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: owner } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Место не найдено');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Неправильный id'));
      } else {
        next(err);
      }
    });
};

const removeLike = (req, res, next) => {
  const owner = req.user._id;

  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: owner } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Место не найдено');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Неправильный id'));
      } else {
        next(err);
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
