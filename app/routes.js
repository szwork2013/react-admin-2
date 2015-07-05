var User = require(__dirname + '/controllers/User.js');
var Group = require(__dirname + '/controllers/Group.js');

// module.exports = function(app, auth) {
module.exports = function(router, auth) {

    function renderProfile(req, res) {
        console.log(req.session);
        if(req.session.user_id === 0) {
            res.redirect('/admin');
        } else if(req.session.user_id) {
            res.redirect('/profile');
        } else {
            res.render('index.html');
        }
    };

    router.get('/', renderProfile);

    router.post('/login', function(req, res, next) {
        auth.login(req.body.username, req.body.password, function(err, user) {
            if(!user) {
                res.status(401).json({errorMessage: 'Incorrect name and/or password'});
            } else {
                req.session.user_id = user.id;
                renderProfile(req, res);
            }
        });
    });

    router.get('/logout', auth.logout);

    // app.post('/signup', function(req, res, next) {
    //     auth.signup(req.body.username, req.body.password, req.body.group, function(message, user) {
    //         if(!user) {
    //             res.status(400).json({errorMessage: message});
    //         } else {
    //             req.session.user_id = user.id;
    //             res.redirect('/profile');
    //         }
    //     });
    // });

    router.get('/profile', auth.isLoggedIn, function(req, res) {
        res.render('profile.html');
    });

    router.get('/admin', auth.isAdmin, function(req, res) {
        res.render('admin.html');
    });

    router.route('/api/groups/', auth.isAdmin)
        .get(function(req, res, next) {
            console.log('q: '+JSON.stringify(req.query, null, 4));
            var groups = Group.findAll(req.query);
            res.json(groups);
        });

    router.route('/api/users/', auth.isAdmin)
        .get(function(req, res, next) {
            // var q = url.parse(req.query);
            console.log('q: '+JSON.stringify(req.query, null, 4));
            var users = User.findAll(req.query);
            res.json(users);
        });



};
