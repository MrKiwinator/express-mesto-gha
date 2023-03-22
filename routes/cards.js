const router = require('express').Router();
const {
  createCard, getCards, checkIfCardExist, checkCardOwner, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.post('/', createCard);
router.get('/', getCards);

router.delete('/:id', checkIfCardExist);
router.delete('/:id', checkCardOwner);
router.delete('/:id', deleteCard);

router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
