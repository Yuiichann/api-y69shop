const CartModel = require('../models/cart.model');
const Logging = require('../library/Logging');

const cartFieldSelect = '-items._id';
const userPopulateSelect = 'email username phoneNumber address';
const figurePopulateSelect =
  'title slug discount original_price discounted_price thumbnail in_stock';

const CartController = {
  // @desc Get All Cart
  // @route GET /api/cart
  // @access Private
  getCarts: async (req, res) => {
    try {
      const carts = await CartModel.find({}, cartFieldSelect)
        .populate('uid', userPopulateSelect)
        .populate('items.figure', figurePopulateSelect);

      res.json({ status: 'success', data: carts });
    } catch (error) {
      Logging.error(error);
      return res.status(500).json({ success: false, msg: 'Internal Server Error!' });
    }
  },

  // @desc Get Cart of User
  // @route GET /api/cart/byUser
  // @access Private
  getCartByUser: async (req, res) => {
    const loggedUser = req.user;

    try {
      const cart = await CartModel.findOne({ uid: loggedUser.uid }, cartFieldSelect)
        .populate('uid', userPopulateSelect)
        .populate('items.figure', figurePopulateSelect);

      if (!cart)
        return res.status(404).json({ status: 'error', error: 'Cart not found!' });

      return res.status(200).json({ status: 'success', data: cart });
    } catch (error) {
      Logging.error(error);
      return res.status(500).json({ success: false, msg: 'Internal Server Error!' });
    }
  },

  // @desc Add new cart
  // @route POST /api/cart/addCart
  // @access Private
  addCart: async (req, res) => {
    const loggedUser = req.user;

    let figures = req.body;

    let totalItems = figures.length;
    let totalPrice = 0;

    figures = figures.map((item) => {
      totalPrice += parseInt(item.price) * item.quantities;

      return {
        figure: item.id,
        quantities: item.quantities,
      };
    });

    try {
      // code countineu
    } catch (error) {
      Logging.error(error);
      return res.status(500).json({ success: false, msg: 'Internal Server Error!' });
    }
  },
};

module.exports = CartController;
