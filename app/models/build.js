var bcrypt   = require('bcrypt-nodejs');

var build = function(User, Group) {

    var adminPass = bcrypt.hashSync('admin', bcrypt.genSaltSync(8), null);
    var admin = new User({
        name: 'admin',
        password: adminPass
    });

    admin.save(function(err) {
        if (err) throw err;
        console.log('Created admin');
    });

    var adminGroup = new Group({
        name: 'Admin',
        admin: true,
        users: [admin._id]
    });

    adminGroup.save(function(err) {
        if (err) throw err;
        console.log('Created adminGroup');
    });

    var regularPass = bcrypt.hashSync('regular', bcrypt.genSaltSync(8), null);
    var regularUser = new User({
            name: 'regular1',
            password: regularPass
        });

    regularUser.save(function(err) {
        if (err) throw err;
        console.log('Created regular1');
    });

    var regularUser2 = new User({
            name: 'regular2',
            password: regularPass
        });

    regularUser2.save(function(err) {
        if (err) throw err;
        console.log('Created regular2');
    });

    var regularGroup = new Group({
        name: 'Regular',
        admin: false,
        users: [regularUser._id, regularUser2]
    });

    regularGroup.save(function(err) {
        if (err) throw err;
        console.log('Created regularGroup');
    });
};

var BuildDB = function(User, Group) {

    User.findOne({}, function(err, doc) {
        if(!doc) {
            build(User, Group);
        }
    });

}

module.exports = BuildDB;
