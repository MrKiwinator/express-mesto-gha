const User = require('../models/user');
const { BadRequestError } = require('../utils/errors/bad-request');
const { InternalError } = require('../utils/errors/internal');
const { NotFoundError } = require('../utils/errors/not-found');

// Creating errors:
const internalError = new InternalError('Произошла ошибка');
const createBadRequestError = new BadRequestError('Переданы некорректные данные при создании пользователя');
const findBadRequestError = new BadRequestError('Переданы некорректные данные при поиске пользователя');
const notFoundError = new NotFoundError('Пользователь по указанному _id не найден');

// Create user:
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(200).send({ user });
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

// Get users:
const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => res.status(internalError.statusCode).send({ message: internalError.message }));
};

// Check if user exist:
const checkIfUserExist = (req, res, next) => {
  const userId = req.params.id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(notFoundError.statusCode).send({ message: notFoundError.message });
      }
      next();
    })
    .catch(() => {
      res.status(findBadRequestError.statusCode).send({ message: findBadRequestError.message });
    });
};

// Get user by ID:
const getUserById = (req, res) => {
  const userId = req.params.id;

  User.findById(userId)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(() => {
      res.status(internalError.statusCode).send({ message: internalError.message });
    });
};

// Update user info:
const updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { runValidators: true, new: true },
  )
    .then((user) => {
      res.status(200).send(user);
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

// Update user avatar:
const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { runValidators: true, new: true },
  )
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(() => res.status(internalError.statusCode).send({ message: internalError.message }));
};

module.exports = {
  createUser, getUsers, checkIfUserExist, getUserById, updateUserInfo, updateUserAvatar,
};
