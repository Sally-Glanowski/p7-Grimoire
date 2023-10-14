const { v4: uuidv4 } = require('uuid');

const sharp = require('sharp');
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};
module.exports = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const randomName = uuidv4();
  const extension = MIME_TYPES[req.file.mimetype];

  if (!req.file.mimetype.match(/\/(png|jpg|jpeg)$/)) {
    return next();
  }

  sharp(req.file.buffer)
    .png({ quality: 60 })

    .toFile(`./images/${randomName}.${extension}`)
    .then((data) => {
      req.file.name = `${randomName}.${extension}`;
      next();
    })
    .catch((err) => {
      next(err);
    });
};