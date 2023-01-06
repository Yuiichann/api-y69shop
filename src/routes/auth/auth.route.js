const AuthController = require('../../controllers/auth.controller');
const loginLimiter = require('../../middleware/loginLimiter');

const router = require('express').Router();

router.post('/login', loginLimiter, AuthController.login);

router.get('/refresh', AuthController.refresh);

router.post('/logout', AuthController.logout);

module.exports = router;
