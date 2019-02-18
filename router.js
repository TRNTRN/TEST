var express = require('express');
var db = require('./manageDB/handle');
var session = require('express-session');
//Create a Router
var router = express.Router();

router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000*60*5,//maintain the session for 5 minutes
    },
}))

router.get('/index', function(req, res) {
    if (req.session.username) {
        res.render('index.html', {username: req.session.username});
    } else {
        res.render('index.html');
    }
})

//Handle the sort requirement from ajax
//sort by recent project
router.get('/recentProject', function(req, res) {
    db.sortByRecent(function(err, data) {
        if (err) {
            return res.status(500).send('Server error.')
        }
        res.send(data)
    })
})

//sort by project title
router.get('/projectTitle', function(req, res) {
    db.sortByprojectTitle(function(err, data) {
        if (err) {
            return res.status(500).send('Server error.')
        }
        res.send(data)
    })
})

//sort by category name
router.get('/category', function(req, res) {
    db.sortBycategory(function(err, data) {
        if (err) {
            return res.status(500).send('Server error.')
        }
        res.send(data)
    })
})

//sort by user name
router.get('/username', function(req, res) {
    db.sortByusername(function(err, data) {
        if (err) {
            return res.status(500).send('Server error.')
        }
        res.send(data)
    })
})

module.exports = router