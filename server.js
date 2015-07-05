var express  = require('express');
var app      = express();

var mongoose = require('mongoose');
var morgan       = require('morgan');
var bodyParser   = require('body-parser');
var ejs = require('ejs');

var jwt    = require('jsonwebtoken');
var config = require('./config');
var User   = require('./app/models/user');
var Group   = require('./app/models/group');
var UserGroup   = require('./app/models/userGroup');
var bcrypt   = require('bcrypt-nodejs');

var port     = process.env.PORT || 8080;
mongoose.connect(config.database);
app.set('superSecret', config.secret);
var BuildDB = require('./app/models/build');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// log request to console
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views');
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

var routes = express.Router();

routes.get('/', function(req, res) {
    res.render('index.html');
});

routes.post('/login', function(req, res) {
  User.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

    if(!user.validPassword(req.body.password)) {
        res.status(401).json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        var token = jwt.sign(user, app.get('superSecret'), {
          expiresInMinutes: 1440 // expires in 24 hours
        });

        console.log('user: ' + user);
        res.json({
          admin: user.admin,
          token: token
        });
      }

    }

  });
});

function ensureAuthorized(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
      jwt.verify(token, app.get('superSecret'), function(err, decoded) {
        if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token.' });
        } else {
          req.decoded = decoded;
          next();
        }
      });

    } else {
      return res.status(403).send({
          success: false,
          message: 'No token provided.'
      });
    }
}

routes.get('/logout', ensureAuthorized, function(req, res) {
    res.status(200).json();
});

routes.get('/admin', ensureAuthorized, function(req, res) {
    res.render('admin.html');
});

routes.get('/profile', ensureAuthorized, function(req, res) {
    res.render('profile.html');
});


// API ROUTES -------------------

// get an instance of the router for api routes
var apiRoutes = express.Router();

apiRoutes.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        req.decoded = decoded;
        next();
      }
    });

  } else {
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });
  }
});

apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

apiRoutes.route('/users')
    .get(function(req, res) {
        var q = User.find();
        if(req.query.include && req.query.include === 'group') {

        }
        q.exec(function(err, users) {
            // _.each(users, function(user, index) {
            //     var admin = false;
            //     var groups = [];
            //     UserGroup.find({user: user._id}), function(err, userGroups) {
            //         // _.each()
            //         response.linked.push(userGroups);
            //     };
            // });
            // response.push(users);
            res.json(users);
        });
    });

apiRoutes.route('/groups')
    .get(function(req, res) {
        var q = Group.find();
        if(req.query.include && req.query.include === 'user') {
            q.populate('user', 'name');
        }
        q.exec(function(err, groups) {
            res.json(groups);
        });
    });

apiRoutes.route('/userGroups')
    .get(function(req, res) {
        UserGroup.find()
        .populate(['user', 'group'])
        .exec(function(err, userGroups) {
            res.json(userGroups);
        });
    });


app.use('/', routes);
app.use('/api', apiRoutes);

BuildDB(User, Group, UserGroup);

app.listen(port);
console.log('Listening on ' + port);
