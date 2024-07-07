const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");

const booksCtrl = require("../controllers/books.controllers");

router.post("/", auth, multer, booksCtrl.createBook);
router.post("/:id/rating", auth, booksCtrl.createBookRating);
router.put("/:id", auth, multer, booksCtrl.modifyBook);
router.delete("/:id", auth, booksCtrl.deleteBook);
router.get("/", auth, booksCtrl.getAllBooks);
router.get("/:id", auth, booksCtrl.getBook);
router.get("/bestrating", auth, booksCtrl.getBestBookRating);

module.exports = router;