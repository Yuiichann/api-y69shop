const CartController = require('../../controllers/cart.controller');
const verifyToken = require('../../middleware/verifyToken');
const router = require('express').Router();

router.get('/', CartController.getCarts);

router.get('/byUser', verifyToken, CartController.getCartByUser);

router.post('/addCart', verifyToken, CartController.addCart);

module.exports = router;
