const Logging = require('../library/Logging');
const OrderModel = require('../models/order.model');

const OrderController = {
  create: async (req, res) => {
    let figures = req.body.items;

    res.json(figures);

    try {
    } catch (error) {
      Logging.error(error);
      return res.status(500).json({ status: 'error', error: 'Internal Server Error!' });
    }
  },
};

module.exports = OrderController;
