const Logging = require('../library/Logging');
const UserModel = require('../models/user.model');
const UsedVoucherModel = require('../models/usedVoucher.model');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;
const LIMIT_ITEM = 10;

const UserController = {
  // @desc Get Users
  // @route GET /api/user
  // @access ADMIN
  getAllUser: async (req, res) => {
    const loggedUser = req.user;

    // roles admin
    if (loggedUser.roles !== 'admin') {
      return res.status(401).json({
        status: 'error',
        error: 'User does not have permission to access this resource!',
      });
    }

    let page = parseInt(req.query.page) - 1 || 0;
    if (page < 0)
      return res
        .status(400)
        .json({ status: 'error', error: 'Page query must be greater than 0' });

    try {
      const totalUser = await UserModel.countDocuments({});

      const totalPage = Math.ceil(totalUser / LIMIT_ITEM);

      // nếu query page > tổng số trang thì trả về trang đầu tiên
      if (page + 1 > totalPage) {
        page = 0;
      }

      const users = await UserModel.find()
        .skip(page * LIMIT_ITEM)
        .limit(LIMIT_ITEM)
        .exec();

      return res
        .status(500)
        .json({ status: 'success', totalUser, totalPage, data: users });
    } catch (error) {
      Logging.error(error);
      return res.status(500).json({ status: 'error', msg: 'Internal Server Error!' });
    }
  },

  // @desc Get One User by ID
  // @route GET /api/user/info/:id
  // @access ADMIN
  getUserById: async (req, res) => {
    const loggedUser = req.user;
    const { id } = req.params;

    if (loggedUser.roles !== 'admin') {
      return res.status(401).json({
        status: 'error',
        msg: 'User does not have permission to access this resource!',
      });
    }

    try {
      const user = await UserModel.findById(id);

      if (!user) {
        return res.status(400).json({ status: 'error', msg: 'User not found!' });
      }

      return res.status(200).json({ status: 'success', data: user });
    } catch (error) {
      Logging.error(error);
      return res.status(500).json({ status: 'error', msg: 'Internal Server Error!' });
    }
  },

  // @desc Register new user
  // @route POST /api/user/register
  // @access Public
  createUser: async (req, res) => {
    const { password, email } = req.body;

    try {
      // kiểm tra email đã tồn tại chưa?
      const checkUserExists = await UserModel.findOne({ email });

      if (checkUserExists) {
        return res.status(409).json({ status: 'error', error: 'Email already exists!' });
      }

      // hash password
      const hashPwd = await bcrypt.hash(password, SALT_ROUNDS);

      const user = new UserModel({
        ...req.body,
        password: hashPwd,
      });

      user.save().then((data) => {
        const usedVoucher = new UsedVoucherModel({
          uid: data._id,
          used_vouchers: [],
        });

        usedVoucher.save();

        return res
          .status(200)
          .json({ success: true, msg: 'Create new user successfully!', user: data });
      });
    } catch (error) {
      Logging.error(error);
      return res.status(500).json({ status: 'error', msg: 'Internal Server Error!' });
    }
  },
};

module.exports = UserController;
