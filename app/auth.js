var User = require('./db/resources/User');
var Group = require('./db/resources/Group');

var Auth = {
    isLoggedIn: function(req, res, next) {
        console.log(req.session);
        if (req.session.user_id) {
            console.log(req.session.user_id);
            return next();
        }

        res.redirect('/');
    },

    logout: function(req, res) {
        delete req.session.user_id;
        res.redirect('/');
    },

    login: function(name, password, done) {
        var user = User.findByName(name);

        if (!user) {
            done(null, null);
        }

        if(!User.validPassword(user, password)) {
            done(null, null);
        }

        done(null, user);
    },

    signup: function(name, password, group, done) {
        var user = User.findByName(name);

        if (user) {
            return done('username taken', null);
        } else {
            var newUser = User.create(name, password, group);
            return done('success', newUser);
        }
    }
};

module.exports = Auth;
