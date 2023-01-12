/*
  Hàm gọi api để update file ảnh lên cloudinary
  Thâm số nhận vào là file và path folder
  Hàm trả về link của file vừa upload
*/

const cloudinary = require('../config/cloudinary');

function UploadImage(file, folder) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload(file, { folder: `y69shop/figures/${folder}` })
      .then((res) => resolve(res.secure_url))
      .catch((err) => reject(err));
  });
}

module.exports = UploadImage;
