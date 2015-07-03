module.exports = function(app, auth) {

    app.get('/', function(req, res) {
        if(req.session.user_id) {
            res.redirect('/profile');
        } else {
            res.render('index.html');
        }
    });

    app.get('/profile', auth.isLoggedIn, function(req, res) {
        res.render('profile.html');
    });

    app.post('/login', function(req, res, next) {
        auth.login(req.body.username, req.body.password, function(err, user) {
            if(!user) {
                res.status(401).json({errorMessage: 'invalid creds'});
            } else {
                req.session.user_id = user.id;
                res.redirect('/profile');
                res.render();
                /*
                    need to call res.render or res.send is because setting
                    the cookie does not initiate the response. Send and Render
                    do. This cookie method just adds a cookie to the response
                    object.
                */
            }
        });
    });

    app.get('/logout', auth.logout);

    app.post('/signup', function(req, res, next) {
        auth.signup(req.body.username, req.body.password, req.body.group, function(message, user) {
            if(!user) {
                res.status(400).json({errorMessage: message});
            } else {
                req.session.user_id = user.id;
                res.redirect('/profile');
            }
        });
    });

};
