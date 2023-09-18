const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({  //methode de mongoose
    userId: { type: String, required: true},
    title: { type: String, required: true, unique:true},
    author: {type: String, required: true},
    imageUrl: { type: String, required: true },//pas de 'unique'--> 
    //peut avoir plrs editions avec la même image
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: [
    {
      userId: { type: String, required: true },
      grade: { type: Number, required: true },
    },
  ],
  averageRating: { type: Number, required: true },
});

module.exports = mongoose.model("Book", bookSchema); //méthode model-->réutilisable

