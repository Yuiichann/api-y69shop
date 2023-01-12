/*
  Hàm gọi api để xóa thư mục cùng các file ảnh bên trong 
  Được gọi khi xóa 1 figure
  tham số nhận vào là path của folder
*/

const cloudinary = require('../config/cloudinary');
const Logging = require('../library/Logging');

module.exports = (path) => {
  cloudinary.api
    .delete_resources_by_prefix(path)
    .then(() => {
      Logging.success(`Delete All Resources in ${path} ==> Delete folder . . .`);

      cloudinary.api
        .delete_folder(path)
        .then(() => Logging.success('Delete folder success'))
        .catch((err) => Logging.error(err));
    })
    .catch((err) => Logging.error(err));
};
