const Card = require('../models/card');
const { BadRequestError } = require('../utils/errors/bad-request');
const { InternalError } = require('../utils/errors/internal');
const { NotFoundError } = require('../utils/errors/not-found');

// Creating errors:
const internalError = new InternalError('Произошла ошибка');
const createBadRequestError = new BadRequestError('Переданы некорректные данные при создании карточки');
const likeBadRequestError = new BadRequestError('Переданы некорректные данные для постановки / снятия лайка');
const findBadRequestError = new BadRequestError('Переданы некорректные данные при поиске карточки');
const notFoundError = new NotFoundError('Передан несуществующий _id карточки');

// Create card
const createCard = (req, res) => {
  const { name, link } = req.body;
  // hardcode owner (have to update in the future)
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(createBadRequestError.statusCode)
          .send({ message: createBadRequestError.message });
        return;
      }
      res.status(internalError.statusCode).send({ message: internalError.message });
    });
};

// Get cards
const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      console.log(cards[0].owner._id.toString());
      res.status(200).send(cards);
    })
    .catch(() => res.status(internalError.statusCode).send({ message: internalError.message }));
};

// Check if card exist
const checkIfCardExist = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        res.status(notFoundError.statusCode).send({ message: notFoundError.message });
        return;
      }
      next();
    })
    .catch(() => {
      res.status(findBadRequestError.statusCode).send({ message: findBadRequestError.message });
    });
};

// Check if user is owner of card:
const checkCardOwner = (req, res, next) => {
  const userId = req.user._id;

  Card.findById(req.params.id)
    .then((card) => {
      if (userId !== card.owner.toString()) {
        throw new Error('Ты мне не хозяин!');
      }
      next();
    })
    .catch((err) => {
      res.status(findBadRequestError.statusCode).send({ message: err.message });
    });
};

// Delete card
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      res.status(200).send({ card });
    })
    .catch(() => res.status(internalError.statusCode).send({ message: internalError.message }));
};

// Like card
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(notFoundError.statusCode).send({ message: notFoundError.message });
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(likeBadRequestError.statusCode).send({ message: likeBadRequestError.message });
        return;
      }
      res.status(internalError.statusCode).send({ message: internalError.message });
    });
};

// Dislike card
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(notFoundError.statusCode).send({ message: notFoundError.message });
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(likeBadRequestError.statusCode).send({ message: likeBadRequestError.message });
        return;
      }
      res.status(internalError.statusCode).send({ message: internalError.message });
    });
};

module.exports = {
  createCard, getCards, checkIfCardExist, checkCardOwner, deleteCard, likeCard, dislikeCard,
};
