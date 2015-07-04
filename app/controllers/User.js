var fs = require('fs');
var bcrypt = require('bcrypt-nodejs');
var _ = require('underscore');

var userDataPath = __dirname + '/db/users.json';
var users = require(userDataPath);

var Group = require(__dirname + '/Group')

var User = {

  users: users,

    writeUserData: function() {
        fs.writeFile(userDataPath, JSON.stringify(this.users, null, 4), function(err) {
            if(err) {
                return err;
            }
        });
    },

    create: function(name, password, groupName) {
        console.log('Creating user' + name + ' ' + password);
        var userId = this.users.length;
        this.users.push({
            'id': userId,
            'name': name,
            'password': this.generateHash(password),
            'is_deleted': 0
        });

        var err = Group.assignUser(userId, groupName);
        if(err) {
            this.users.splice(userId, 1);
            return err;
        }

        err = this.writeUserData();
        if(err) {
            this.users.splice(userId, 1);
            // Group.removeUser(userId, groupName);
            return err;
        }

        return this.users[userId];
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
