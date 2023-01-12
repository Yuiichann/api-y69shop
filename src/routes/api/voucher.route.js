const VoucherController = require('../../controllers/voucher.controller');
const { ValidateJoi, validateSchema } = require('../../middleware/joi');
const verifyToken = require('../../middleware/verifyToken');
const router = require('express').Router();

router.get('/code/:code', VoucherController.getVoucherByCode);

router.post(
  '/create',
  verifyToken,
  ValidateJoi(validateSchema.voucher.create),
  VoucherController.create
);

module.exports = router;
