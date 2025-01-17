const Book = require("../models/Book");
const fs = require("fs")
const path = require("path");

exports.createBook = (req, res, next) => {
    const dataObject = JSON.parse(req.body.book);
    delete dataObject._id;
    delete dataObject._userId;

    const book = new Book({
        ...dataObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${path.basename(req.file.path)}`,
    });
    book.save()
    .then(() => res.status(201).json({message: "Livre enregistré"}))
    .catch(error => res.status(400).json({error}));
};

exports.createBookRating = (req, res, next) => {
    let alreadyRated = false;

    Book.findOne({_id: req.params.id})
    .then((book) => {
        book.ratings.forEach(rate => {
            if (rate.userId === req.body.userId) {
                alreadyRated = true;
                console.log("Tentative de création de plusieurs note avec le même userId");
            }
        });

        if (!alreadyRated) {
            let newRatings = book.ratings;
            newRatings.push({userId: req.body.userId, grade: req.body.rating});

            const totalRates = newRatings.length;
            const sum = newRatings.reduce((acc, obj) => acc + obj.grade, 0);
            const newAverageRating = totalRates > 0 ? (sum / totalRates).toFixed(2) : 0;

            Book.updateOne({ _id: book._id }, {$set: {ratings: newRatings, averageRating: newAverageRating}})
            .then(() => res.status(200).json(book))
            .catch(error => res.status(400).json({error}));
        }
    })
    .catch(error => res.status(400).json({error}));
};

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${path.basename(req.file.path)}`
    } : {...req.body};

    delete bookObject._id;
    Book.findOne({_id: req.params.id})
    .then((book) => {
        if (book.userId != req.auth.userId) {
            res.status(401).json({message: "Non-autorisé"})
        } else {
            Book.updateOne({_id: req.params.id}, {...bookObject, _id: req.params.id})
            .then(() => {
                const filename = book.imageUrl.split("/images/")[1];
                
                if (bookObject?.imageUrl !== undefined && filename !== bookObject?.imageUrl) {
                    fs.unlink(`images/${filename}`, (err) => {
                        if (err) {
                            console.error("Erreur lors de la suppression du fichier :", err);
                        } else {
                            console.log(`Fichier ${filename} supprimé avec succès`);
                        }
                    });
                }
                res.status(200).json({message: "Livre modifié"});
            })
            .catch(error => res.status(400).json({error}));
        }
    })
    .catch(error => res.status(400).json({error}));
};

exports.deleteBook = (req, res, next) => {
    Book.findOne({_id: req.params.id})
    .then(book => {
        if (book.userId != req.auth.userId) {
            res.status(401).json({message: "Non-autorisé"})
        } else {
            const filename = book.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
                Book.deleteOne({_id: req.params.id})
                .then(() => res.status(200).json({message: "Livre supprimé"}))
                .catch(error => res.status(401).json({error}));
            })
        }
    })
    .catch(error => res.status(500).json({error}));
};

exports.getAllBooks = (req, res, next) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({error}));
};


exports.getBook = (req, res, next) => {
    Book.findOne({_id: req.params.id})
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({error}));
};

exports.getBestRatedBooks = (req, res, next) => {
    Book.find()
    .then(books => res.status(200).json(books.sort((a, b) => b.averageRating - a.averageRating).slice(0, 3)))
    .catch(error => res.status(400).json({error}));
};