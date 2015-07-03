var fs = require('fs');
var _ = require('underscore');

var groupDataPath = __dirname + '/data/groups.json';
var groups = require(groupDataPath);

var UserGroup = require(__dirname + '/UserGroup')

var Group = {

  groups: groups,

    writeGroupData: function() {
        fs.writeFile(groupDataPath, JSON.stringify(this.groups, null, 4), function(err) {
            if(err) {
                return err;
            }
        });
    },

    create: function(name) {
        console.log('Creating group' + name);
        var groupId = this.groups.length;
        this.groups.push({
            'id': groupId,
            'name': name,
            'is_deleted': 0
        });

        var err = this.writeGroupData();
        if(err) {
            this.groups.splice(groupId, 1);
            return err;
        }

        return this.groups[groupId];
    },

    assignUser: function(userId, groupName) {
        var group = this.findByName(groupName);
        var groupCreated = false;
        if(!group) {
            group = this.create(groupName);
            groupCreated = true;
        }

        var err = UserGroup.assign(userId, group.id);
        if(err) {
            if(groupCreated) {
                // this.remove(group.id);
            }
            return err;
        }

        return null;
    },

    findById: function(groupId) {
        var foundGroup = _.find(this.groups, function(group) {
            return group.id === groupId && !group.is_deleted;
        });

        return foundGroup;
    },

    findByName: function(groupName) {
        var foundGroup = _.find(this.groups, function(group) {
            return group.name === groupName && !group.is_deleted;
        });

        return foundGroup;
    }
};

module.exports = Group;
