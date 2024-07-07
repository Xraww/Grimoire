const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");

const booksCtrl = require("../controllers/books.controllers");

router.post("/", auth, multer, booksCtrl.createBook);
router.post("/:id/rating", auth, booksCtrl.createBookRating);
router.put("/:id", auth, multer, booksCtrl.modifyBook);
router.delete("/:id", auth, booksCtrl.deleteBook);
router.get("/", booksCtrl.getAllBooks);
router.get("/bestrating", booksCtrl.getBestRatedBooks);
router.get("/:id", booksCtrl.getBook);

module.exports = router;