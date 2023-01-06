const Logging = require('../library/Logging');
const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const UserController = {
  // @desc Get Users
  // @route GET /api/user
  // @access Private
  getAllUser: async (req, res) => {
    const loggedUser = req.user;

    if (loggedUser.roles !== 'admin') {
      return res.status(401).json({
        status: 'error',
        msg: 'User does not have permission to access this resource!',
      });
    }

    try {
      const users = await UserModel.find();

      return res.status(500).json({ status: 'success', data: users });
    } catch (error) {
      Logging.error(error);
      return res.status(500).json({ status: 'error', msg: 'Internal Server Error!' });
    }
  },

  // @desc Get One User by ID
  // @route GET /api/user/info/:id
  // @access Private
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
      const checkUserExists = await UserModel.findOne({ email });

      if (checkUserExists) {
        return res.status(409).json({ status: 'error', msg: 'Email already exists!' });
      }

      const hashPwd = await bcrypt.hash(password, SALT_ROUNDS);

      const user = new UserModel({
        ...req.body,
        password: hashPwd,
      });

      await user
        .save()
        .then((data) =>
          res
            .status(200)
            .json({ success: true, msg: 'Create new user successfully!', user: data })
        );
    } catch (error) {
      Logging.error(error);
      return res.status(500).json({ status: 'error', msg: 'Internal Server Error!' });
    }
  },
};

module.exports = UserController;
