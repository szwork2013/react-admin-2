var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var ejs = require('ejs');

var morgan       = require('morgan');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var Auth = require('./app/auth.js');

app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views');
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

app.use(session({
        secret: 'super-secret',
        name: 'example-admin',
        cookie: {
            secure: false,
            maxAge: (4 * 60 * 60 * 1000) // 4 hours
        },
        resave: true,
        saveUninitialized: true
    }));

require('./app/routes.js')(app, Auth);

app.listen(port);
console.log('Listening on ' + port);
