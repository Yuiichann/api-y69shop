const Logging = require('../library/Logging');
const OrderModel = require('../models/order.model');
const UsedVoucherModel = require('../models/usedVoucher.model');

const LIMIT_ITEM = 10;

const orderFieldSelect = '-createdAt -updatedAt -items._id';
const figurePolulateSelect =
  'title slug original_price discount discounted_price thumbnail';
const userPopulateSelect = 'email username';

const OrderController = {
  // @desc Create new order
  // @route POST /api/order/create
  // @access Private
  create: async (req, res) => {
    const { voucher } = req.body;
    const loggedUser = req.user;

    try {
      // lấy thông tin các voucher mà use hiện tại đã sử dụng
      const checkUsedVoucher = await UsedVoucherModel.findOne({
        uid: loggedUser.uid,
      });

      // kiểm tra voucher đã được sử dụng chưa
      if (checkUsedVoucher.used_vouchers.includes(voucher)) {
        return res
          .status(400)
          .json({ status: 'error', error: 'User already used this voucher!' });
      }

      // khởi tạo order
      const order = new OrderModel({ uid: loggedUser.uid, ...req.body });

      await order.save();

      // add voucher vào list voucher đã được sử dụng của user
      await UsedVoucherModel.findOneAndUpdate(
        { uid: loggedUser.uid },
        {
          used_vouchers: [...checkUsedVoucher.used_vouchers, voucher],
        }
      );

      return res
        .status(200)
        .json({ status: 'success', msg: 'Order Success!', data: order });
    } catch (error) {
      Logging.error(error);
      return res.status(500).json({ status: 'error', error: 'Internal Server Error!' });
    }
  },

  // @desc GET list orders
  // @route GET /api/order/
  // @access ADMIN
  getOrders: async (req, res) => {
    const loggedUser = req.user;

    // chỉ roles admin ms được get
    if (loggedUser.roles !== 'admin') {
      return res.status(401).json({
        status: 'error',
        error: 'User does not have permission to access this resource!',
      });
    }

    // query page
    let page = parseInt(req.query.page) - 1 || 0;

    // check query page
    if (page < 0)
      return res
        .status(400)
        .json({ status: 'error', error: 'Page query must be greater than 0' });

    try {
      const totalOrders = await OrderModel.countDocuments();

      const totalPage = Math.ceil(totalOrders / LIMIT_ITEM);

      // nếu query page > tổng số trang thì trả về trang đầu tiên
      if (page + 1 > totalPage) {
        page = 0;
      }

      const orders = await OrderModel.find({}, orderFieldSelect)
        .skip(page * LIMIT_ITEM)
        .limit(LIMIT_ITEM)
        .populate('items.figure', figurePolulateSelect)
        .populate('voucher')
        .populate('uid', userPopulateSelect)
        .exec();

      return res
        .status(200)
        .json({ status: 'success', totalOrders, totalPage, data: orders });
    } catch (error) {
      Logging.error(error);
      return res.status(500).json({ status: 'error', error: 'Internal Server Error!' });
    }
  },

  // @desc Create new order
  // @route GET /api/order/create
  // @access Private
  getOrdersByUser: async (req, res) => {
    const loggedUser = req.user;

    try {
      // GET các order của user hiện tại
      const orders = await OrderModel.find({ uid: loggedUser.uid }, orderFieldSelect)
        .populate('items.figure', figurePolulateSelect)
        .populate('voucher')
        .populate('uid', userPopulateSelect)
        .exec();

      if (orders.length === 0)
        return res.status(404).json({ status: 'error', error: 'Order not found!' });

      return res.status(200).json({ status: 'success', data: orders });
    } catch (error) {
      Logging.error(error);
      return res.status(500).json({ status: 'error', error: 'Internal Server Error!' });
    }
  },

  // @desc Update info order
  // @route POST /api/order/updateByUser/:id
  // @access Private
  updateInfoByUser: async (req, res) => {
    const { phoneNumber, address } = req.body;
    const loggedUser = req.user;
    const { id } = req.params;

    try {
      // tìm kiếm order đúng của user
      const foundOrder = await OrderModel.findOne({ _id: id, uid: loggedUser.uid });

      if (!foundOrder)
        return res.status(404).json({ status: 'error', error: 'Order not found' });

      // chỉ order chưa được xác nhận ms có quyền thay đổi thông tin
      if (foundOrder.status !== 'waiting') {
        return res
          .status(400)
          .json({ status: 'error', error: 'Confirmed order cannot be changed!' });
      }

      // update
      const updatedOrder = await OrderModel.findOneAndUpdate(
        { _id: id, uid: loggedUser.uid },
        {
          phoneNumber,
          address,
        },
        { returnDocument: 'after' }
      );

      return res
        .status(200)
        .json({ status: 'success', msg: 'Update Order Success!', data: updatedOrder });
    } catch (error) {
      Logging.error(error);
      return res.status(500).json({ status: 'error', error: 'Internal Server Error!' });
    }
  },

  // @desc Update status
  // @route POST /api/order/updateStatus/:id
  // @access ADMIN
  updateStatus: async (req, res) => {
    const loggedUser = req.user;
    const { id } = req.params;
    const { status } = req.body;

    // roles admin
    if (loggedUser.roles !== 'admin') {
      return res.status(401).json({
        status: 'error',
        error: 'User does not have permission to access this resource!',
      });
    }

    // tương tự update info order

    try {
      const foundOrder = await OrderModel.findOne({
        _id: id,
        uid: loggedUser.uid,
      });

      if (!foundOrder)
        return res.status(404).json({ status: 'error', error: 'Order not found' });

      if (foundOrder.status === 'cancelled' || foundOrder.status === 'finish') {
        return res.status(400).json({
          status: 'error',
          error: 'The order has been completed so the status cannot be changed!',
        });
      }

      const updatedOrder = await OrderModel.findOneAndUpdate(
        {
          _id: id,
          uid: loggedUser.uid,
        },
        { status },
        {
          returnDocument: 'after',
        }
      );

      return res
        .status(200)
        .json({ status: 'success', msg: 'Update Order Success!', data: updatedOrder });
    } catch (error) {
      Logging.error(error);
      return res.status(500).json({ status: 'error', error: 'Internal Server Error!' });
    }
  },
};

module.exports = OrderController;
