const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createCard, getCards, checkIfCardExist, checkCardOwner, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required(),
  }),
}), createCard);
router.get('/', getCards);

router.delete('/:id', checkIfCardExist);
router.delete('/:id', checkCardOwner);
router.delete('/:id', deleteCard);

router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
