const express = require("express");
let books = require("./booksdb.js");
const { users } = require("./auth_users.js");
let isValid = require("./auth_users.js").isValid;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const user = { username: req.body.username, password: req.body.password };
  if (user.username && !isValid(user.username)) {
    users.push(user);
    return res.status(201).json({ message: "successfully registered" });
  } else {
    return res.status(400).json({ message: "invalid input" });
  }
});

const getBooks = (details) => {
  if (!details) {
    return books;
  }
  const { isbn, author = '', title = '' } = details;

  if (isbn) {
    return books[isbn];
  }

  return Object.fromEntries(
    Object.entries(books).filter(
      ([id, book]) => book.author === author || book.title === title
    )
  );
};

// Get the book list available in the shop
public_users.get("/", async function(req, res) {
  //Write your code here
  try {
    const bookDetails = await getBooks();
    console.log(bookDetails)
    return res.status(200).json({ books: JSON.stringify(bookDetails) });
  } catch (err) {
    return res.status(400).json({ mesaage: "issue in retrive books" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function(req, res) {
  try {
    const filteredBooks = await getBooks({ isbn: req.params.isbn });
    return res.status(200).json({ books: JSON.stringify(filteredBooks) });
  } catch (err) {
    return res.status(400).json({ mesaage: "issue in filter by isbn" });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  try {
    const filteredBooks = await getBooks({ author: req.params.author })
    return res
      .status(200)
      .json({ books: JSON.stringify(filteredBooks) });
  } catch (err) {
    return res.status(400).json({ mesaage: "issue in filter by author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  try {
    const filteredBooks = await getBooks({ title: req.params.title })
    return res
      .status(200)
      .json({ books: JSON.stringify(filteredBooks) });
  } catch (err) {
    return res.status(400).json({ mesaage: "issue in filter by title" });
  }
});

//  Get book review
public_users.get("/review/:isbn", async function (req, res) {
  try {
    const book = await getBooks({ isbn: req.params.isbn })
    return res.status(200).json({ reviews: JSON.stringify(book?.reviews || {}) });
  } catch (err) {
    return res.status(400).json({ mesaage: "issue in retrive reviews" });
  }
});

module.exports.general = public_users;
