const mongoose = require("mongoose");
const uniqueValidateur = require("mongoose-unique-validator");
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, 
    password: {type: String, required: true },
  });
  userSchema.plugin(uniquevalidateur)
module.exports= mongoose("userSchema");