const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((next));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params._id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Место не найдено');
      }

      if (card.owner.toString() !== req.user._id) {
        throw new UnauthorizedError('Недостаточно прав');
      }

      Card.findByIdAndRemove(req.params.cardId)
        .then(() => {
          res.send({ data: card });
        })
        .catch(next);
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
    .catch(next);
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
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
};
