const express = require('express');
let books = require("./booksdb.js");
const { users } = require('./auth_users.js');
let isValid = require("./auth_users.js").isValid;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const user = { username :  req.body.username , password : req.body.password}
    if(user.username && !isValid(user.username)){
        users.push(user)
        return res.status(201).json({ message: "successfully registered" });
    }else{
        return res.status(400).json({ message: "invalid input" });
    }
});

// Get the book list available in the shop
public_users.get('/', function async(req, res) {
    //Write your code here
    try {
        return res.status(200).json({ books: JSON.stringify(books) });
    } catch (err) {
        return res.status(400).json({ mesaage: "issue in retrive books" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    try {
        const filteredBooks = books[req.params.isbn] || {}
        return res.status(200).json({ books: JSON.stringify(filteredBooks) });
    } catch (err) {
        return res.status(400).json({ mesaage: "issue in filter by isbn" });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    try {
        const filteredBooks = Object.entries(books).find(([id,book]) => books.author === req.params.author)
        return res.status(200).json({ books: JSON.stringify(Object.fromEntries(filteredBooks)) });
    } catch (err) {
        return res.status(400).json({ mesaage: "issue in filter by author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    try {
        const filteredBooks = Object.entries(books).find(([id,book]) => books.title === req.params.title)
        return res.status(200).json({ books: JSON.stringify(Object.fromEntries(filteredBooks)) });
    } catch (err) {
        return res.status(400).json({ mesaage: "issue in filter by title" });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    try {
        const reviews = books[req.params.isbn]?.reviews || {}
        return res.status(200).json({ reviews: JSON.stringify(reviews) });
    } catch (err) {
        return res.status(400).json({ mesaage: "issue in retrive reviews" });
    }
});

module.exports.general = public_users;
