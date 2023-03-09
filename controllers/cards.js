const Card = require('../models/card');
const InvalidData = require('../errors/invalid-data');

const createCard = (req, res) => {
  const { name, link } = req.body;
  // hardcode owner (have to update in the future)
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      console.log(card);
      res.status(200).send({ card });
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      res.status(200).send({ card });
    })
    .catch((err) => console.log(err.name, err.statusCode, err.message));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then(() => {
      res.status(200).send('Card is liked!');
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then(() => {
      res.status(200).send('Card is disliked!');
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports = {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
};
