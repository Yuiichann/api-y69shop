/*
  Middleware dùng để kiểm tra dữ liệu post từ client
*/

const Joi = require('joi');

const ValidateJoi = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (error) {
      return res
        .status(422)
        .json({ success: false, msg: 'Invalid information!', error: error.details });
    }
  };
};

const validateSchema = {
  figure: {
    add: Joi.object({
      title: Joi.string().required(),
      original_price: Joi.number().integer().min(0).required(),
      discount: Joi.number().integer().min(0).max(100).required(),
      category: Joi.string()
        .required()
        .valid('scale-figure', 'nendoroid', 'pop-up-parade', 'figma', 'r-18', 'others'),
      scale: Joi.string()
        .required()
        .valid('non-scale', '1/3', '1/4', '1/5', '1/6', '1/7', '1/8', '1/10', '1/12'),
      manufacturer: Joi.string().required(),
      in_stock: Joi.number().integer().min(1).required(),
      character: Joi.string().required(),
      series: Joi.string().required(),
      size: Joi.string().required(),
      description: Joi.string().required(),
      thumbnail: Joi.any(),
      collections: Joi.any(),
    }),
    update: Joi.object({
      original_price: Joi.number().min(0),
      discount: Joi.number().integer().min(0),
      category: Joi.string().valid(
        'scale-figure',
        'nendoroid',
        'pop-up-parade',
        'figma',
        'r-18',
        'others'
      ),
      scale: Joi.string().valid(
        'non-scale',
        '1/3',
        '1/4',
        '1/5',
        '1/6',
        '1/7',
        '1/8',
        '1/10',
        '1/12'
      ),
      manufacturer: Joi.string(),
      in_stock: Joi.number().integer().min(0),
      character: Joi.string(),
      size: Joi.string(),
      description: Joi.string(),
    }),
  },

  user: {
    create: Joi.object({
      email: Joi.string().email().required(),
      username: Joi.string().required(),
      password: Joi.string()
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
        .required(),
      phoneNumber: Joi.string()
        .regex(/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/)
        .required(),
      address: Joi.string().required(),
    }),
  },

  voucher: {
    create: Joi.object({
      code: Joi.string()
        .regex(/^[A-Za-z\d]{6,8}$/)
        .required(),
      type: Joi.string().valid('percent', 'number').required(),
      value: Joi.number().required().min(0).integer(),
      condition: Joi.number().min(0).integer(),
      maxPrice: Joi.number().min(0).integer().required(),
      amount: Joi.number().integer().min(1).required(),
      description: Joi.string().required(),
    }),
  },

  order: {
    create: Joi.object({
      phoneNumber: Joi.string()
        .regex(/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/)
        .required(),
      address: Joi.string().required(),
      payment_method: Joi.string().valid('cash').required(),
      voucher: Joi.string(),
      total: Joi.number().min(0).required(),
      items: Joi.array()
        .items(
          Joi.object({
            figure: Joi.string().required(),
            quantities: Joi.number().integer().min(1).required(),
          })
        )
        .required(), // array {figure:id, quantities: 2}
    }),

    updateInfoUser: Joi.object({
      phoneNumber: Joi.string()
        .regex(/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/)
        .required(),
      address: Joi.string().required(),
    }),

    updateStatus: Joi.object({
      status: Joi.string()
        .valid('cancelled', 'waiting', 'confirmed', 'delivering', 'finish')
        .required(),
    }),
  },
};

module.exports = { ValidateJoi, validateSchema };
