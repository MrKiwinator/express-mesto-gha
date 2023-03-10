const Card = require('../models/card');
const { BadRequestError } = require('../utils/errors/bad-request');
const { InternalError } = require('../utils/errors/internal');
const { NotFoundError } = require('../utils/errors/not-found');

// Creating errors:
const internalError = new InternalError('Произошла ошибка');
const createBadRequestError = new BadRequestError('Переданы некорректные данные при создании карточки');
const likeBadRequestError = new BadRequestError('Переданы некорректные данные для постановки/снятии лайка');
const notFoundError = new NotFoundError('Передан несуществующий _id карточки');

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

const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => res.status(internalError.statusCode).send({ message: internalError.message }));
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      res.status(200).send({ card });
    })
    .catch(() => res.status(internalError.statusCode).send({ message: internalError.message }));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(likeBadRequestError.statusCode).send({ message: likeBadRequestError.message });
        return;
      }
      if (err.name === 'CastError') {
        res.status(notFoundError.statusCode).send({ message: notFoundError.message });
        return;
      }
      res.status(internalError.statusCode).send({ message: internalError.message });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(likeBadRequestError.statusCode).send({ message: likeBadRequestError.message });
        return;
      }
      if (err.name === 'CastError') {
        res.status(notFoundError.statusCode).send({ message: notFoundError.message });
        return;
      }
      res.status(internalError.statusCode).send({ message: internalError.message });
    });
};

module.exports = {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
};
