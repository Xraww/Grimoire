const Book = require("../models/Book");

exports.createBook = (req, res, next) => {
    const dataObject = JSON.parse(req.body.book);
    delete dataObject._id;
    delete dataObject._userId;
    const book = new Book({
        ...dataObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    });
    book.save()
    .then(() => res.status(201).json({message: "Livre enregistré"}))
    .catch(error => res.status(400).json({error}));
};

exports.createBookRating = (req, res, next) => {
    
};

exports.modifyBook = (req, res, next) => {
    
};

exports.deleteBook = (req, res, next) => {
    
};

exports.getAllBooks = (req, res, next) => {
    
};


exports.getBook = (req, res, next) => {
    
};

exports.getBestBookRating = (req, res, next) => {
    
};