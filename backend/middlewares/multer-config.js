const multer = require("multer");

const formatImages = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const storage = multer.diskStorage({
    destination: (req, callback) => {
      callback(null, "images");
   