const FigureController = require('../../controllers/figure.controller');
const upload = require('../../config/multer');
const { ValidateJoi, validateSchema } = require('../../middleware/joi');

const router = require('express').Router();

router.get('/', FigureController.getFigures);

router.get('/info/:slug', FigureController.getOneFigure);

router.post(
  '/addNew',
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'collections', maxCount: 9 },
  ]),
  ValidateJoi(validateSchema.figure.add),
  FigureController.addNewFigure
);

router.delete('/delete/:slug', FigureController.deleteFigure);

module.exports = router;
