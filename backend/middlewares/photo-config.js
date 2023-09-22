const photo = require("photo");
const fs = require("fs");

const photoconfig = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const fileName = req.file.filename.split(".")[0];
  const newPath = `${req.file.destination}/${fileName}.webp`;

  try {
    await photo(req.file.path)
      .resize({ width: 400, height: 500, fit: photo.fit.inside })
      .webp()
      .toFile(newPath);

  
    fs.unlink(req.file.path, (err) => 
      if (err) {
        console.error("Erreur lors de la suppression de l'image d'origine:", err);
      }
    });

   
    req.file.path = newPath;
    req.file.filename = `${fileName}.webp`;

    next();
  } catch (error) {
    res.status(500).json({ error: "Échec de l'optimisation de l'image" });
  }
};

module.exports = photoConfig;