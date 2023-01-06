const { parentPort, workerData } = require("worker_threads");
const cloudinary = require("../config/cloudinary");

cloudinary.uploader
  .upload(workerData.file, {
    folder: `y69shop/figure/${worderData.slug}`,
  })
  .then((data) => parentPort.postMessage(data.secure_url))
  .catch((err) => parentPort.postMessage(err));
