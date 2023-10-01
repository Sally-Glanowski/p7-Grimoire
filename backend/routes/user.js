const express = require("express");

const router = express.Router();

const userCtrl = require("../controllers/user");
const emailValidateur = require("../middlewares/validateur-email");
const passwordValidateur = require("../middlewares/password-validateur");

router.post("/signup", emailValidateur, passwordValidateur, userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;