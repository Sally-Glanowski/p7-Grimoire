const multer = require("multer");

const formatImages = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, "images");
    },
    filename: (req, file, callback) => {
      const name = file.originalname.split(" ").join("_");
      const extension = formatImages[file.mimetype];
     