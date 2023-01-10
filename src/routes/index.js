const router = require('express').Router();
const { manufacturerList } = require('../constants/figureConstant');
const FigureRoutes = require('./api/figure.route');
const UserRoutes = require('./api/user.route');
const CartRoutes = require('./api/cart.route');
const AuthRoutes = require('./auth/auth.route');
const VoucherRoutes = require('./api/voucher.route');
const OrderRoutes = require('./api/order.route');

// SSR --------------------------------------------------------
router.get('/', (req, res) => {
  res.render('index');
});

router.get('/them-san-pham', (req, res) => {
  res.render('add', {
    title: 'Thêm sản phẩm mới',
    manufacturers: manufacturerList,
  });
});

// AUTH ROUTES -------------------------------------------------
router.use('/auth', AuthRoutes);

// API ROUTES --------------------------------------------------
router.use('/api/figure', FigureRoutes);
router.use('/api/user', UserRoutes);
router.use('/api/cart', CartRoutes);
router.use('/api/voucher', VoucherRoutes);
router.use('/api/order', OrderRoutes);

// 404 ---------------------------------------------------------
router.all('*', (req, res) => res.status(404).json({ msg: 'Not found' }));

module.exports = router;
