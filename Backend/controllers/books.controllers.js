const Book = require("../models/Book");

exports.getAllBooks = (req, res, next) => {
    
}

exports.getBestBookRating = (req, res, next) => {
    
}

exports.createBook = (req, res, next) => {
    delete req.body._id;
    const book = new Book({
        ...req.body
    });

    book.save()
    .then(() => res.status(201).json({message: "Livre enregistré"}))
    .catch(error => res.status(400).json({error}));
};

exports.getBook = (req, res, next) => {
    
}

exports.createBookRating = (req, res, next) => {
    
}

exports.modifyBook = (req, res, next) => {
    
}

exports.deleteBook = (req, res, next) => {
    
}