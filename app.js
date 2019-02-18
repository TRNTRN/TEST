var express = require('express');
var router = require('./router');
var bodyParser = require('body-parser');
var user = require('./routes/User')

var app = express();

app.use('/node_modules/', express.static('./node_modules/'))
app.use('/public/', express.static('./public/'))

app.engine('html', require('express-art-template'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extend: true }))

app.use(router)

app.use(user)

app.listen(3000, function() {
  console.log('Running at 3000...')
});

module.exports = app;
