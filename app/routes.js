module.exports = function(app, passport) {

    app.get('/', function(req, res) {
        res.render('index.html');
    });

    app.get('/login', function(req, res) {
        res.render('login.html');
    });

    app.get('/signup', function(req, res) {
        res.render('signup.html');
    });

    app.get('/profile', isLoggedIn, function(req, res) {
      console.log('getting prof');
        res.render('profile.html', {
            user : req.user
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/signup', passport.authenticate('signup', {
        successRedirect : '/profile',
        failureRedirect : '/signup',
        failureFlash : false
    }));

    app.post('/login', passport.authenticate('login', {
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash : false
    }));

};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
}
