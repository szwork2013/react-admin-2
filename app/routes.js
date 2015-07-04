var Group = require(__dirname + '/controllers/Group.js');

module.exports = function(app, auth) {

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

    app.get('/', renderProfile);

    app.post('/login', function(req, res, next) {
        auth.login(req.body.username, req.body.password, function(err, user) {
            if(!user) {
                res.status(401).json({errorMessage: 'Incorrect name and/or password'});
            } else {
                req.session.user_id = user.id;
                renderProfile(req, res);
            }
        });
    });

    app.get('/logout', auth.logout);

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

    app.get('/profile', auth.isLoggedIn, function(req, res) {
        console.log('profiling');
        res.render('profile.html');
    });

    app.get('/admin', auth.isAdmin, function(req, res) {
        console.log('admining');
        res.render('admin.html');
    });

    app.get('/api/groups', auth.isAdmin, function(req, res) {
        var groups = Group.findAll();
        res.json(groups);
    });


};
