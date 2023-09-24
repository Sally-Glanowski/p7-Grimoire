const express = require("express");

const router = express.Router();
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");
const photoConfig = require("../middlewares/photo-config");

const bookCtrl = require("../controllers/book");

router.get("/", bookCtrl.getAllBooks);
router.get("/bestrating", bookCtrl.getBestBooks);
router.get("/:id", bookCtrl.getSingleBook);

router.post("/", auth, multer, photoConfig, bookCtrl.createBook);
router.post("/:id/rating", auth, bookCtrl.rateBook);

router.put("/:id", auth, multer, photoConfig, bookCtrl.updateBook);

router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;