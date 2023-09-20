const mongoose = require("mongoose");
const uniqueValidateur = require("mongoose-unique-validator");
const userSchema = mongoose.Schema({
    email: {required: true, unique: true }
    password: {required: true },
  });