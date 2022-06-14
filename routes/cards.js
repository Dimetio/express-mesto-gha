const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards/:cardId', createCard);
router.delete('/cards', deleteCard);
router.put('/cards/:cardId/likes', addLike);
router.delete('/cards/:cardId/likes', removeLike);

module.exports = router;
