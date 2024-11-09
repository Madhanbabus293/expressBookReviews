const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    return users.findIndex(user => user.username === username) >= 0
}

const authenticatedUser = (username, password) => { //returns boolean
    const foundedUser = users.find(user => user.username === username && user.password === password)
    if(!foundedUser){
        return false
    }

    return true
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const reqBody = req.body
    if (!isValid(reqBody.username)) {
        return res.status(401).json({ message: "Invalid User" })
    }

    if (!authenticatedUser(reqBody.username, reqBody.password)) {
        return res.status(401).json({ message: "Invalid User / Password" });
    }

    const token = jwt.sign({
        data: reqBody.password
    }, 'keyforauth', { expiresIn: '1h' })

    req.session.authorization = {
        username : reqBody.username,
        accesstoken : token
    }

    return res.status(200).json({ message: "successfully logged", accessToken : token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
