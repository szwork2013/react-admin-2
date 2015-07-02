var LocalStrategy = require('passport-local').Strategy;
var User = require('./db/resources/User');

// expose this function to our app using module.exports
module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        console.log('serialize id: ' + user);
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        console.log('deserialize id: ' + id);
        user = User.findById(id);
        console.log('user: ' + user);
        done(null, user);
    });

    passport.use('signup', new LocalStrategy({
        usernameField : 'name',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, name, password, done) {
        console.log('finding by name');
        var user = User.findByName(name);

        if (user) {
            console.log('already a user');
            return done(null, false, 'That email is already taken.');
        } else {
            console.log('creating user');
            var newUser = User.create(name, password);
            return done(null, newUser);
        }
    }));

    passport.use('login', new LocalStrategy({
        usernameField : 'name',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, name, password, done) {

        console.log('finding by name');
        var user = User.findByName(name);

        if (!user) {
            console.log('no user');
            return done(null, false, 'The credentials were incorrect.');
        }

        if(!User.validPassword(user, password)) {
            console.log('invalid password');
            return done(null, false, 'The credentials were incorrect.');
        }

        return done(null, user);
    }));


};
