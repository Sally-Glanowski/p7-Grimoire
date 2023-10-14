const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//const fetch = require("node-fetch"); 
const User = require("../models/user");
require('dotenv').config();

exports.signup = (req, res, next) => {
  console.log(req);
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => {
          fetch(process.env.API_URL)
            .then((response) => response.json())
            .then((data) => {
              res.status(201).json({ message: "Nouvel utilisateur créé!", data }); 
            })
            .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  console.log('connection reussie');
  User.findOne({ email: req.body.email })
  
    .then((user) => {
      if (!user) {
        return res.status(200).json({ error: "Utilisateur ou mot de passe incorrect!" });
      };
      
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Utilisateur ou mot de passe incorrect!" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
              expiresIn: "1h"
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};