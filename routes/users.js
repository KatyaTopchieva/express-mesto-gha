const router = require('express').Router();

const {
  getUsers,
  getUserId,
  getCurrentUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

const {
  userIdValidation,
  updateProfileValidation,
  updateAvatarValidation,
} = require('../utils/validations');

router.get('/users', getUsers);
router.get('/users/me', getCurrentUser);
router.get('/users/:userId', userIdValidation, getUserId);
router.patch('/users/me', updateProfileValidation, updateProfile);
router.patch('/users/me/avatar', updateAvatarValidation, updateAvatar);

module.exports = router;
