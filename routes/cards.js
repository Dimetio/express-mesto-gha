const router = require('express').Router();
const { getCards, createCard, deleteCard } = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards/:cardId', createCard);
router.delete('/cards', deleteCard);

module.exports = router;
