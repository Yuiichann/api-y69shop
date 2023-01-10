const VoucherController = require('../../controllers/voucher.controller');
const { ValidateJoi, validateSchema } = require('../../middleware/joi');
const router = require('express').Router();

router.get('/:code', VoucherController.getVoucherByCode);

router.post(
  '/create',
  ValidateJoi(validateSchema.voucher.create),
  VoucherController.create
);

module.exports = router;
