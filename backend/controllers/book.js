const Book = require("../models/book");
const fs = require("fs");
const fetch = require('node-fetch');
const DB_URL = process.env.DB_URL;


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
      console.log('erreur enregistrement')
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
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename.split(".")[0]
        }.webp`,
      }
    : { ...req.body }; // sinon,  utilisation du book existant du corps de la requête
  delete bookObject._userId; // supprime la propriété userid de l'objet livre
  Book.findOne({ _id: req.params.id })
  .then((book) => {
    if (book.userId != req.auth.userId) {
      res.status(403).json({ message: "403: requête non autorisée" });
    } else if (req.file) {
      // Si un nouveau fichier est téléchargé, supprime l'ancien fichier image
      const filename = book.imageUrl.split("/images")[1];
      fs.unlink(`images/${filename}`, () => {});
    }
    Book.updateOne(
      { _id: req.params.id }, // 
      { ...bookObject, _id: req.params.id } // Met à jour le livre correspondant à l'ID
    )
      .then(res.status(200).json({ message: "Livre modifié ! " }))
      .catch((error) => res.status(400).json({ error }));
  })
  .catch((error) => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
Book.findOne({ _id: req.params.id })
  .then((book) => {
    if (book.userId != req.auth.userId) {
      res.status(401).json({ message: "Non autorisé" });
    } else {
      const filename = book.imageUrl.split("/images/")[1]; // Extrait le nom du fichier de l'URL de l'image du livre
      fs.unlink(`images/${filename}`, () => {
        //  le fichier image correspondant du système de fichiers
        Book.deleteOne({ _id: req.params.id }) // Supprime le livre de la base de données
          .then(() => {
            res.status(200).json({ message: "Livre supprimé!" });
          })
          .catch((error) => res.status(401).json({ error }));
      });
    }
  })
  .catch((error) => res.status(500).json({ error }));
};

exports.rateBook = (req, res, next) => {
const user = req.body.userId;
if (user !== req.auth.userId) {
  res.status(401).json({ message: "Non autorisé" });
} else {
  Book.findOne({ _id: req.params.id }) // Recherche le livre par ID
    .then((book) => {
      if (book.ratings.find((rating) => rating.userId === user)) {
        // Vérifie si l'utilisateur a déjà noté le livre
        res.status(401).json({ message: "Livre déjà noté" });
      } else {
        const newRating = {
          // Crée un objet newRating
          userId: user,
          grade: req.body.rating,
          _id: req.body._id,
        };
        const updatedRatings = [...book.ratings, newRating];
        // Ajoute le newRating au tableau de notes existant

        function calcAverageRating(ratings) {
          // Calcule la note moyenne
          const sumRatings = ratings.reduce(
            (total, rate) => total + rate.grade,
            0
          );
          const average = sumRatings / ratings.length;
          return parseFloat(average.toFixed(2)); // Arrondir la moyenne à 2 décimales
        }

        // Met à jour le document du livre
        Book.findOneAndUpdate(
          { _id: req.params.id, "ratings.userId": { $ne: user } }, // Recherche le livre avec l'identifiant donné et s'assure
           //que l'utilisateur ne l'a pas déjà noté
          // $ne = pas égal
          {
            $push: { ratings: newRating }, // Ajoutela nouvelle note au tableau des notes
            averageRating: calcAverageRating(updatedRatings), // Met à jour le champ AverageRating
          },
          { new: true } // Renvoyez le document du livre mis à jour
        )
          .then
          fetch(DB_URL)
          ((updatedBook) => res.status(201).json(updatedBook))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => res.status(401).json({ error }));
}
};
