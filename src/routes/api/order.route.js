const OrderController = require('../../controllers/order.controller');
const { ValidateJoi, validateSchema } = require('../../middleware/joi');
const router = require('express').Router();

router.post('/create', ValidateJoi(validateSchema.order.create), OrderController.create);

module.exports = router;
