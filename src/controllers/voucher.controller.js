const VoucherModel = require('../models/voucher.model');
const Logging = require('../library/Logging');

const VoucherController = {
  // @desc Create new voucher
  // @route POST /api/voucher/create
  // @access Private
  create: async (req, res) => {
    const { type } = req.body;
    let maxPrice = req.body.maxPrice;

    if (type === 'number') {
      maxPrice = 0;
    }

    try {
      const voucher = new VoucherModel({ ...req.body, maxPrice });

      await voucher
        .save()
        .then((data) => res.status(200).json({ status: 'success', data }))
        .catch((err) => {
          Logging.error(err);
          return res.status(400).json({ status: 'error', error: err });
        });
    } catch (error) {
      Logging.error(error);
      return res.status(500).json({ status: 'error', error: 'Internel Server Error!' });
    }
  },

  // @desc GET voucher by code
  // @route GET /api/voucher/:code
  // @access Private
  getVoucherByCode: async (req, res) => {
    const { code } = req.params;

    if (!code)
      return res.status(400).json({ status: 'error', error: 'Code is required!' });

    try {
      const voucher = await VoucherModel.findOne({ code });

      if (!voucher)
        return res.status(404).json({ status: 'error', error: 'Code not found!' });

      return res.status(200).json({ status: 'success', data: voucher });
    } catch (error) {
      Logging.error(error);
      return res.status(500).json({ status: 'error', error: 'Internel Server Error!' });
    }
  },
};

module.exports = VoucherController;
