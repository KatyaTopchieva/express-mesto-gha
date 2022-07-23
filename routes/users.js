const router = require('express').Router();
const user = require('../models/user');

const { getUsers, getUserId, createUser, } = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUserId);
router.post('/users', createUser);

module.exports = router;