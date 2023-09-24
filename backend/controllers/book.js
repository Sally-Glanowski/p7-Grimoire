const Book = require("../models/book");
const fs = require("fs");

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.getSingleBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(400).json({ error }));
};

exports.getBestBooks = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(401).json({ error }));
};
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename.split(".")[0]
    }.webp`,
    averageRating: bookObject.ratings[0].grade,
  });
  book
    .save()
    .then(() => {
      res.status(201).json({ message: "Livre enregistré!" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
exports.updateBook = (req, res, next) => {
    const bookObject = req.file
      ? {
          // si le fichier est téléchargé, l'objet livre se crée avec la nouvelle url de l'image
          ...JSON.parse(req.body),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename.split(".")[0]
          }.webp`,
        }
      : { ...req.body }; // sinon,  utilisation du book existant du corps de la requête
    delete bookObject._userId; // supprime la propriété userid de l'objet livre
  