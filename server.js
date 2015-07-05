var express  = require('express');
var app      = express();

var mongoose = require('mongoose');
var morgan       = require('morgan');
var bodyParser   = require('body-parser');
var ejs = require('ejs');

var config = require('./config');
var User   = require('./app/models/user');
var Group   = require('./app/models/group');

var port     = process.env.PORT || 8080;
mongoose.connect(config.database);
app.set('superSecret', config.secret);
var BuildDB = require('./app/models/build');

// log request to console
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views');
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

require(__dirname + '/app/routes')(app);
BuildDB(User, Group);

app.listen(port);
console.log('Listening on ' + port);
