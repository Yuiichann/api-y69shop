const UserController = require('../../controllers/user.controller');
const { ValidateJoi, validateSchema } = require('../../middleware/joi');
const verifyToken = require('../../middleware/verifyToken');

const router = require('express').Router();

router.get('/', verifyToken, UserController.getAllUser);

router.get('/info/:id', verifyToken, UserController.getUserById);

router.post(
  '/register',
  ValidateJoi(validateSchema.user.create),
  UserController.createUser
);

module.exports = router;
