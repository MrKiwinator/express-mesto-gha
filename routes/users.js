const router = require('express').Router();
const {
  createUser, getUsers, checkIfUserExist, getUserById, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', checkIfUserExist);
router.get('/:id', getUserById);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
