require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");

const booksRoutes = require("./routes/books.routes");
const userRoutes = require("./routes/user.routes");

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("Connexion à MongoDB réussie !"))
.catch((err) => console.log("Connexion à MongoDB échouée !", err));

const app = express();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

app.use(express.json());

app.use("/api/books", booksRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;