var express = require('express');
var db = require('../manageDB/handle');
var session = require('express-session');
//Create a Router
var User = express.Router();

User.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000*60*5,//maintain the session for 5 minutes
    },
}))

//Jump to log in page
User.get('/login', function(req, res) {
    res.render('login.html');
})

//Deal with the response from log in page
User.post('/login', function(req, res) {
    var user = {
        username: req.body.username,
        password: req.body.password
    }
    db.verifyUser(user).then((data) => {
        req.session.username = user.username;
        res.redirect('/index');
    }, function(err) {
        res.redirect('/login');
    });
})

//Jump to register page
User.get('/register', function(req, res) {
    res.render('register.html');
})

//Deal with the response from register page
User.post('/register', function(req, res) {
    var user = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    }
    db.createUser(user).then((data) => {
        req.session.username = user.username;
        res.redirect('/index')
    }, function(err) {
        res.redirect('/register')
    });

})

User.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/index');
})

module.exports = User