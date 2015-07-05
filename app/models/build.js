var bcrypt   = require('bcrypt-nodejs');

var build = function(User, Group, UserGroup) {

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
        user: admin._id
    });

    adminGroup.save(function(err) {
        if (err) throw err;
        console.log('Created adminGroup');
    });




    // var userGroup = new UserGroup({
    //     user: admin._id,
    //     group: adminGroup._id
    // });
    //
    // userGroup.save(function(err) {
    //     if (err) throw err;
    //     console.log('Created userGroup');
    // });





};

var BuildDB = function(User, Group, UserGroup) {

    User.findOne({}, function(err, doc) {
        if(!doc) {
            build(User, Group, UserGroup);
        }
    });

}

module.exports = BuildDB;
