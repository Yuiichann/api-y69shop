const CartController = require('../../controllers/cart.controller');
const router = require('express').Router();

router.get('/', CartController.getCart);

router.post('/addCart', CartController.addCart);

module.exports = router;
