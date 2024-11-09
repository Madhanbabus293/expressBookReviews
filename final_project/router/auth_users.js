const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  return users.findIndex((user) => user.username === username) >= 0;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  const foundedUser = users.find(
    (user) => user.username === username && user.password === password
  );
  if (!foundedUser) {
    return false;
  }

  return true;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const reqBody = req.body;
  if (!isValid(reqBody.username)) {
    return res.status(401).json({ message: "Invalid User" });
  }

  if (!authenticatedUser(reqBody.username, reqBody.password)) {
    return res.status(401).json({ message: "Invalid User / Password" });
  }

  const token = jwt.sign(
    {
      username: reqBody.username,
    },
    "access",
    { expiresIn: "1h" }
  );

  req.session.authorization = {
    username: reqBody.username,
    accesstoken: token,
  };

  return res
    .status(200)
    .json({ message: "successfully logged", accessToken: token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  try {
    const isAdd = req.body?.isAdd;
    const filteredBook = books[req.params.isbn];
    if (!filteredBook) {
      throw "not found book";
    }

    if (isAdd) {
      const review = { desc: req.body.desc, title: req.body.title };
      filteredBook.reviews = review;
    } else {
      if (req.body.title) {
        filteredBook.reviews["title"] = req.body.title;
      }

      if (req.body.desc) {
        filteredBook.reviews["desc"] = req.body.desc;
      }
    }
    return res
      .status(200)
      .json({ message: isAdd ? "Review added" : "Review updated" });
  } catch (e) {
    return res.status(400).json({ message: "issue in add/update review" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  try {
    const filteredBook = books[req.params.isbn] || {};
    filteredBook.reviews = {};
    return res.status(204).json({ message: "deleted" });
  } catch (e) {
    return res.status(400).json({ message: "issues in delete review" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
