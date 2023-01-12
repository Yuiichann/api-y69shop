const Logging = require('../library/Logging');
const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const GenerateTokens = require('../utils/GenerateTokens');
const config = require('../config/config');

const AuthController = {
  // @desc Login
  // @route POST /auth/login
  // @access Public
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const foundUser = await UserModel.findOne({ email });

      if (!foundUser) {
        return res
          .status(401)
          .json({ status: 'error', msg: 'Email or password Invalid!' });
      }

      // so sánh pwd
      const matchPwd = await bcrypt.compare(password, foundUser.password);

      if (!matchPwd)
        return res
          .status(401)
          .json({ status: 'error', msg: 'Email or password Invalid!' });

      // tạo 2 token
      const tokens = GenerateTokens({
        uid: foundUser._id,
        username: foundUser.username,
        email: foundUser.email,
        roles: foundUser.roles,
      });

      // lưu refresh token trên cookies, accessToken thì client tự lưu
      res.cookie('jwt', tokens.refreshToken, {
        httpOnly: true, //accessible only by web server
        secure: true, //https
        sameSite: 'None', //cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
      });

      return res
        .status(200)
        .json({ msg: 'Login success!', accessToken: tokens.accessToken });
    } catch (error) {
      Logging.error(error);
      return res.status(500).json({ status: 'error', msg: 'Internal Server Error!' });
    }
  },

  // @desc Refresh Token
  // @route POST /auth/refresh
  // @access Public - because access token has expired
  refresh: (req, res) => {
    const cookies = req.cookies;

    // kiểm tra cookie có lưu refresh token ko, nếu có thì check, nếu không thì user chưa login
    if (!cookies?.jwt)
      return res.status(401).json({ status: 'error', msg: 'Unauthorized' });

    const refreshToken = cookies.jwt;

    // check refresh token
    jwt.verify(refreshToken, config.jwt.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ status: 'error', msg: 'Forbidden' });

      const foundUser = await UserModel.findOne({ email: decoded.email });

      if (!foundUser)
        return res.status(401).json({ status: 'error', msg: 'Unauthorized' });

      // nếu refresh Token hợp lệ thì tạo lại cả 2 token và set cookie token mới 
      const tokens = GenerateTokens({
        uid: foundUser._id,
        username: foundUser.username,
        email: foundUser.email,
        roles: foundUser.roles,
      });

      res.cookie('jwt', tokens.refreshToken, {
        httpOnly: true, //accessible only by web server
        secure: true, //https
        sameSite: 'None', //cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
      });

      return res.status(200).json({ accessToken: tokens.accessToken });
    });
  },

  // @desc Logout
  // @route POST /auth/logout
  // @access Public - just to clear cookie if exists
  logout: (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(204); //No content

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

    res.json({ msg: 'Cookie cleared' });
  },
};

module.exports = AuthController;
