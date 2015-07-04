var User = require(__dirname + '/controllers/User.js');

var Auth = {
    isAdmin: function(req, res, next) {
        if(req.session.user_id === 0) {
            return next();
        }

        res.redirect('/');
    },

    isLoggedIn: function(req, res, next) {
        // console.log(req.session);
        if (req.session.user_id) {
            console.log(req.session.user_id);
            return next();
        }

        res.redirect('/');
    },

    logout: function(req, res) {
        // delete req.session.user_id;
        req.session.destroy();
        res.redirect('/');
    },

    login: function(name, password, done) {
        var user = User.findByName(name);

        if (!user) {
            return done(null, null);
        }

        if(!User.validPassword(user, password)) {
            return done(null, null);
        }

        return done(null, user);
    },

    // signup: function(name, password, group, done) {
    //     var user = User.findByName(name);
    //
    //     if (user) {
    //         return done('username taken', null);
    //     } else {
    //         var newUser = User.create(name, password, group);
    //         return done('success', newUser);
    //     }
    // }

};

module.exports = Auth;
