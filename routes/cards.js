const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().uri(({ scheme: ['http', 'https'] })),
  }),
}), createCard);
router.get('/', getCards);

// router.use('/:id', celebrate({
//   params: Joi.object().keys({
//     id: Joi.string().required().length(24).hex(),
//   }),
// }), checkIfCardExist);

// router.delete('/:id', checkCardOwner);

router.use('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
  }),
}));

router.delete('/:id', deleteCard);
router.put('/:id/likes', likeCard);
router.delete('/:id/likes', dislikeCard);

module.exports = router;
