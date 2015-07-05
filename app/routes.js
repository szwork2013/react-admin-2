var express  = require('express');
var _ = require('underscore');
var jwt    = require('jsonwebtoken');

var User   = require(__dirname + '/models/user');
var Group   = require(__dirname + '/models/group');

module.exports = function(app) {
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
            var userToken = {
                userName: user.name,
                userId: user._id,
                admin: false
            };

            // find if user is admin
            Group.find({users: user._id}, function(err, groups) {
                _.each(groups, function(group) {
                    console.log(group);
                    if(group.admin) {
                        userToken.admin = true;
                    }
                });

                var token = jwt.sign(userToken, app.get('superSecret'), {
                  expiresInMinutes: 1440 // expires in 24 hours
                });

                res.json({
                    user: user.name,
                    admin: userToken.admin,
                    token: token
                });

            });
          }

        }

      });
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
      res.json({
            routes: {
                users: '/users',
                groups: '/groups'
            }
        });
    });

    apiRoutes.route('/users')
        .get(function(req, res) {
            console.log('decoded: ' + JSON.stringify(req.decoded,null,4));
            var q;
            if(req.decoded.admin) {
                q = Group.find();
            } else {
                //non-admin can only see groups that they belong to
                q = Group.find({users:
                    { $in: [
                        req.decoded.userId
                    ]}
                });
            }

            q.populate('users', 'name');
            q.lean();
            if(req.query.include && req.query.include === 'group') {
                q.exec(function(err, groups) {
                    var users = [];
                    _.each(groups, function(group, index) {
                        var usersInGroup = _.map(group.users, function(user) {
                           user.group = { id: group._id, name: group.name };
                           return user;
                        });
                        users.push(usersInGroup);
                    });
                    res.json(_.flatten(users));
                });
            } else {
                q.exec(function(err, groups) {
                    var users = [];
                    _.each(groups, function(group, index) {
                        var usersInGroup = _.map(group.users, function(user) {
                           return user;
                        });
                        users.push(usersInGroup);
                    });
                    res.json(_.flatten(users));
                });
            }
        });

    apiRoutes.route('/groups')
        .get(function(req, res) {
            console.log('decoded: ' + JSON.stringify(req.decoded,null,4));
            var q;
            if(req.decoded.admin) {
                var q = Group.find();
            } else {
                //non-admin can only see groups that they belong to
                var q = Group.find({users:
                    { $in: [
                        req.decoded.userId
                    ]}
                });
            }
            if(req.query.include && req.query.include === 'user') {
                q.populate('users', 'name');
            }
            q.exec(function(err, groups) {
                res.json(groups);
            });
        })

        .post(function(req, res) {
            console.log('decoded: ' + JSON.stringify(req.decoded,null,4));
            if(!req.decoded.admin) {
                res.json();
                return;
            }
            console.log(req.body);
            var newGroup = new Group({
               name: req.body.name,
               admin: false,
               users: []
           });

           newGroup.save(function(err) {
               if (err) throw err;
               console.log('Created newGroup');
           });

            return res.json();

        });

    apiRoutes.route('/groups/:id')
        .get(function(req, res) {
            console.log('decoded: ' + JSON.stringify(req.decoded,null,4));
            var q;
            if(req.decoded.admin) {
                var q = Group.find({_id: req.params.id});
            } else {
                //non-admin can only see groups that they belong to
                var q = Group.find({users:
                    { $in: [
                        req.decoded.userId
                    ]}
                });
            }
            if(req.query.include && req.query.include === 'user') {
                q.populate('users', 'name');
            }
            q.exec(function(err, groups) {
                res.json(groups);
            });
        })

        .put(function(req, res) {
            console.log('decoded: ' + JSON.stringify(req.decoded,null,4));
            if(!req.decoded.admin) {
                res.json();
                return;
            }
            console.log(req.body);
            Group.findOneAndUpdate(
                {_id: req.params.id},
                req.body,
                {upsert: true},
                function(err, group) {
                    if (err) return res.send(500, { error: err });
                    return res.json(group);
                });
        })

        .delete(function(req, res) {
            if(!req.decoded.admin) {
                res.json();
                return;
            }
            Group.findByIdAndRemove(req.params.id, function(err) {
                if (err) return res.send(500, {error: err});
                res.json();
            })
        });


    app.use('/', routes);
    app.use('/api', apiRoutes);

};
