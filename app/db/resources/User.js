var fs = require('fs');
var bcrypt = require('bcrypt-nodejs');
var _ = require('underscore');

var userDataPath = __dirname + '/data/users.json';
var users = require(userDataPath);

var User = {

  users: users,

    writeUserData: function() {
        fs.writeFile(userDataPath, JSON.stringify(this.users, null, 4), function(err) {
            if(err) {
                return console.log(err);
            }
        });
    },

    create: function(name, password) {
        console.log('Creating user' + name + ' ' + password);
        var index = this.users.length;
        this.users.push({
            'id': index,
            'name': name,
            'password': this.generateHash(password),
            'is_deleted': 0
        });

        var error = this.writeUserData();
        if(error) {
            return error;
        }

        return this.users[index];
    },

    generateHash: function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    },

    validPassword: function(user, password) {
        return bcrypt.compareSync(password, user.password);
    },

    findById: function(userId) {
        var foundUser = _.find(this.users, function(user) {
            return user.id === userId && !user.is_deleted;
        });

        return foundUser;
    },

    findByName: function(userName) {
        console.log(bcrypt.hashSync('admin', bcrypt.genSaltSync(8), null));
        var foundUser = _.find(this.users, function(user) {
            return user.name === userName && !user.is_deleted;
        });

        return foundUser;
    },


};

module.exports = User;
