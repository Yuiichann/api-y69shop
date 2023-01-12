const OrderController = require('../../controllers/order.controller');
const { ValidateJoi, validateSchema } = require('../../middleware/joi');
const verifyToken = require('../../middleware/verifyToken');
const router = require('express').Router();

router.get('/', verifyToken, OrderController.getOrders);

router.get('/byUser', verifyToken, OrderController.getOrdersByUser);

router.post(
  '/create',
  verifyToken,
  ValidateJoi(validateSchema.order.create),
  OrderController.create
);

router.post(
  '/updateByUser/:id',
  verifyToken,
  ValidateJoi(validateSchema.order.updateInfoUser),
  OrderController.updateInfoByUser
);

router.post(
  '/updateStatus/:id',
  verifyToken,
  ValidateJoi(validateSchema.order.updateStatus),
  OrderController.updateStatus
);

module.exports = router;
