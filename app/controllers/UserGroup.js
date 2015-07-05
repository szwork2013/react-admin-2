var fs = require('fs');
var _ = require('underscore');

var userGroupDataPath = __dirname + '/db/userGroups.json';
var userGroups = require(userGroupDataPath);

var UserGroup = {

  userGroups: userGroups,

    writeUserGroupData: function() {
        fs.writeFile(userGroupDataPath, JSON.stringify(this.userGroups, null, 4), function(err) {
            if(err) {
                return err;
            }
        });
    },

    assign: function(userId, groupId) {
        var userGroupId = this.userGroups.length;
        this.userGroups.push({
            'id': userGroupId,
            'user_id': userId,
            'group_id': groupId
        });

        var err = this.writeUserGroupData();
        if(err) {
            this.userGroups.splice(userGroupId, 1);
            return err;
        }

        return null;
    },


    // findById: function(groupId) {
    //     var foundGroup = _.find(this.groups, function(group) {
    //         return group.id === groupId && !group.is_deleted;
    //     });
    //
    //     return foundGroup;
    // },

    getUsersForGroup: function(groupId) {
        var userGroups = _.filter(this.userGroups, function(userGroup) {
            return userGroup.group_id === groupId;
        });
        // console.log('usergropu: '+_.pluck(userGroups, 'user_id'));
        return _.pluck(userGroups, 'user_id');
    }

};

module.exports = UserGroup;
