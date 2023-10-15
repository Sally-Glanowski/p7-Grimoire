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

  sharp(req.file.buffer)
    .webp({ quality: 60 })
    .toFile(`./images/${randomName}.webp`) // Enregistre en format WebP
    .then((data) => {
      req.file.name = `${randomName}.webp`;
      next();
    })
    .catch((err) => {
      next(err);
    });
};
