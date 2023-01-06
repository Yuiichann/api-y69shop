const CartModel = require('../models/cart.model');
const Logging = require('../library/Logging');

const CartController = {
  getCart: async (req, res) => {
    try {
      const carts = await CartModel.find().populate(
        'items',
        'slug title original_price discount discounted_price thumbnail'
      );

      if (req.session.views) {
        req.session.views++;
      }
      {
        req.session.views = 1;
      }

      console.log(req.session.views);

      res.json({ carts });
    } catch (error) {
      Logging.error(error);
      return res.status(500).json({ success: false, msg: 'Internal Server Error!' });
    }
  },

  addCart: async (req, res) => {
    const { figures } = req.body;

    req.session.views = 1;

    try {
      //   let cart = await CartModel.findOne({});

      return res.sendStatus(200);
    } catch (error) {
      Logging.error(error);
      return res.status(500).json({ success: false, msg: 'Internal Server Error!' });
    }
  },
};

module.exports = CartController;
