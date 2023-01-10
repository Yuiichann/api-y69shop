const FigureModel = require('../models/figure.model');
const GenerateSlug = require('../utils/GenerateSlug');
const UploadImage = require('../utils/UploadImage');
const Logging = require('../library/Logging');
const deleteFolderCloudinary = require('../utils/deleteResources');
const { scaleList, categoryList } = require('../constants/figureConstant');

const LIMIT_ITEM = 10;

const FigureController = {
  // @desc Get figures
  // @route GET /api/figure
  // @access Public
  getFigures: async (req, res) => {
    console.log(req.user);

    const search = req.query.search || '';
    let page = parseInt(req.query.page) - 1 || 0;

    if (page < 0)
      return res
        .status(400)
        .json({ status: 'error', error: 'Page query must be greater than 0' });

    let sort = req.query.sort || 'title';
    let scale = req.query.scale || 'all';
    let category = req.query.category || 'all';

    scale === 'all' ? (scale = [...scaleList]) : (scale = req.query.scale.split(','));

    category === 'all'
      ? (category = [...categoryList])
      : (category = req.query.category.split(','));

    req.query.sort ? (sort = req.query.sort.split(',')) : (sort = [sort]);

    let sortBy = {};

    // kiểm ra query sort hợp lệ hay không
    if (sort[1]) {
      if (sort[1] !== 'asc' && sort[1] !== 'desc') {
        return res.status(400).json({
          status: 'error',
          msg: "Query Sort contains only 2 values: 'asc' or 'desc'",
        });
      }

      sortBy[sort[0]] = sort[1];
    } else {
      sortBy[sort[0]] = 'asc';
    }

    try {
      // count documnets ==> tính tổng số trang
      const totalItem = await FigureModel.countDocuments({
        title: { $regex: search, $options: 'i' },
        category: { $in: category },
        scale: { $in: scale },
      });

      const totalPage = Math.ceil(totalItem / LIMIT_ITEM);

      // nếu query page > tổng số trang thì trả về trang đầu tiên
      if (page + 1 > totalPage) {
        page = 0;
      }

      // get documents
      const figures = await FigureModel.find(
        {
          title: { $regex: search, $options: 'i' },
        },
        '-createdAt -updatedAt'
      )
        .where('scale')
        .in(scale)
        .where('category')
        .in(category)
        .sort(sortBy)
        .skip(page * LIMIT_ITEM)
        .limit(LIMIT_ITEM)
        .exec();

      // trả về null
      if (totalItem === 0) {
        return res.status(400).json({ status: 'error', error: 'Figure not found!' });
      }

      return res
        .status(200)
        .json({ status: 'success', totalPage, totalItem, data: figures });
    } catch (error) {
      Logging.error(error);
      return res.status(500).json({ status: 'error', msg: 'Internal Server Error!' });
    }
  },

  // @desc Get one figure
  // @route GET /api/figure/info/:slug
  // @access Public
  getOneFigure: async (req, res) => {
    const { slug } = req.params;
    try {
      const figure = await FigureModel.findOne({ slug });

      if (!figure) {
        return res.status(404).json({ status: 'error', msg: 'Figure not found' });
      }

      return res.status(200).json({ status: 'success', data: figure });
    } catch (error) {
      Logging.error(error);
      return res.status(500).json({ status: 'error', msg: 'Internal Server Error!' });
    }
  },

  // @desc Add new Figure
  // @route POST /api/figure/addNew
  // @access Private
  addNewFigure: async (req, res) => {
    const filesList = { ...req.files };
    const { title, original_price, discount } = req.body;

    // tạo slug
    const slug = GenerateSlug(title);

    // tại tiền đã giảm giá
    const discounted_price = Math.round(
      original_price - (original_price * discount) / 100
    );

    // lặp qua các file và tiến hành lưu trên cloudinary
    let uploadPromises = [];
    for (let item in filesList) {
      for (let file of filesList[item]) {
        uploadPromises.push(UploadImage(file.path, slug));
      }
    }

    // ảnh bìa là item đầu của mảng, còn lại là collections
    const collections = await Promise.all(uploadPromises);
    const thumbnail = collections[0];

    const figure = new FigureModel({
      ...req.body,
      slug,
      discounted_price,
      thumbnail,
      collections,
    });

    figure
      .save()
      .then((data) =>
        res
          .status(200)
          .json({ status: 'success', msg: 'Create new figure success!', data })
      )
      .catch((err) => res.status(400).json({ status: 'error', msg: err }));
  },

  // @desc Update figure
  // @route POST
  // @access Private
  updateFigre: async (req, res) => {
    // can't change title, slug, thumbnail, collections
    // if you want change this, you should delete current figure and add new figure

    // if req.body rỗng
    if (Object.keys(req.body).length === 0)
      return res.status(400).json({ status: 'error', msg: 'Required new Info!' });

    const { slug } = req.params;

    try {
      const foundFigure = await FigureModel.findOne({ slug });

      if (!foundFigure) {
        return res.status(404).json({ status: 'error', msg: 'Figure not found!' });
      }

      // check các trường có update ko
      const discount =
        parseInt(req.body.discount) >= 0
          ? parseInt(req.body.discount)
          : foundFigure.discount;

      const original_price = req.body.original_price
        ? parseInt(req.body.original_price)
        : foundFigure.original_price;

      const discounted_price = Math.round(
        original_price - (original_price * discount) / 100
      );

      const updatedFigure = await FigureModel.findOneAndUpdate(
        { slug },
        {
          ...req.body,
          original_price,
          discount,
          discounted_price,
        },
        {
          returnDocument: 'after',
        }
      );

      return res.status(200).json({
        status: 'success',
        msg: 'Update figure successfully!',
        data: updatedFigure,
      });
    } catch (error) {
      Logging.error(error);
      return res.status(500).json({ status: 'error', msg: 'Internel Server Error!' });
    }
  },

  // @desc Remove figure
  // @route POST /api/figure/delete/:slug
  // @access Private
  deleteFigure: async (req, res) => {
    const { slug } = req.params;

    try {
      const deletedFigure = await FigureModel.findOneAndDelete({ slug });

      if (!deletedFigure) {
        return res.status(404).json({ status: 'error', msg: 'Figure not found!' });
      }

      // delete folder image
      deleteFolderCloudinary(`y69shop/figures/${slug}`);

      return res.status(200).json({
        status: 'success',
        msg: 'Deleted Figure!',
        deleted: deletedFigure,
      });
    } catch (error) {
      Logging.error(error);
      return res.status(500).json({ status: 'error', msg: 'Internal Server Error!' });
    }
  },
};

module.exports = FigureController;
