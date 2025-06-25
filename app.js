const express = require("express");
const path = require("path");
const app = express();
const db = require("./config/db");
const Book = require("./models/bookTBL");
const fs = require("fs");
const multer = require("multer");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "assets")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileuploa = multer({ storage: storage }).single("image");

// Routes
app.get("/addbook", (req, res) => {
  return res.render("addbook");
});

app.post("/addbook", fileuploa, async (req, res) => {
  try {
    let image = "";
    if (req.file) {
      image = req.file.path;
    }

    const {
      title,
      author,
      isbn,
      price,
      quantity,
      genre,
      publishedDate,
      description,
    } = req.body;

    await Book.create({
      title,
      author,
      isbn,
      price,
      quantity,
      genre,
      publishedDate,
      description,
      image,
    });

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.send("Error adding book");
  }
});

app.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.render("booklist", { books });
  } catch (err) {
    res.send("Error while fetching books");
  }
});

app.get("/deleteBook", async (req, res) => {
  try {
    const id = req.query.id;
    let data2 = await Book.findById(id);
    await Book.findByIdAndDelete(id);

    fs.unlinkSync(data2.image);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.send("Error deleting book");
  }
});

app.get("/editbook", async (req, res) => {
  try {
    const editId = req.query.id;
    const book = await Book.findById(editId);
    res.render("editbook", { book });
  } catch (err) {
    console.error(err);
    res.send("Error fetching book for edit");
  }
});

app.post("/editbook", fileuploa, async (req, res) => {
  try {
    const bookId = req.query.id;

    let data2 = await Book.findById(bookId);

    let image = data2.image;
    if (req.file) {
      fs.unlinkSync(data2.image);

      image = req.file.path;

      const {
        title,
        author,
        isbn,
        price,
        quantity,
        genre,
        publishedDate,
        description,
      } = req.body;

      await Book.findByIdAndUpdate(bookId, {
        title,
        author,
        isbn,
        price,
        quantity,
        genre,
        publishedDate,
        description,
        image,
      });

      res.redirect("/");
    }
  } catch (err) {
    console.error(err);
    res.send("Error updating book");
  }
});

app.get('/*"*"', (req, res) => {
  res.render("error");
});

app.listen(3000, () => {
  console.log("Book store app running at http://localhost:3000");
});
