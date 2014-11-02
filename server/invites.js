Invites = new Meteor.Collection('invites');

/*
 Meteor.publish("invites", function(){
 return Invites.find({$or: [{'from.id': userId}, {'to.id': userId} ]});
 })
 */

var makeFriends = function (userId, friendId) {
    var user = Meteor.users.findOne({_id: userId});
    var friend = Meteor.users.findOne({_id: friendId});

    if (user && friend) {
        if (!user.friends) user.friends = [];
        if (!friend.friends) friend.friends = [];

        user.friends = _.union(user.friends, [friendId]);
        friend.friends = _.union(friend.friends, [userId]);

        Meteor.users.update({_id: user._id}, {$set: {friends: user.friends}});
        Meteor.users.update({_id: friend._id}, {$set: {friends: friend.friends}});

        return true;
    } else {
        return false;
    }
};

var revokeFriendship = function (userId, friendId) {
    var user = Meteor.users.findOne({_id: userId});
    var friend = Meteor.users.findOne({_id: friendId});
    if (user && friend) {

        if (user.friends) {
            user.friends = _.without(user.friends, friendId);
        }
        if (friend.friends) {
            friend.friends = _.without(friend.friends, userId);
        }

        Meteor.users.update({_id: user._id}, {$set: {friends: user.friends}});
        Meteor.users.update({_id: friend._id}, {$set: {friends: friend.friends}});

        return true;
    } else {
        return false;
    }
};

var sendInviteEmail = function (invite) {
    sendMessage(invite.from.id, invite.to.email, invite.message, invite._id);
};

var contactEmail = function (user) {
    if (user.emails && user.emails.length)
        return user.emails[0].address;
    if (user.services && user.services.facebook && user.services.facebook.email)
        return user.services.facebook.email;
    return null;
};

var inviteUrl = function (inviteId) {
    return Meteor.absoluteUrl(inviteId);
};

var sendMessage = function (fromId, toEmail, msg, inviteId) {
    var from = Meteor.users.findOne(fromId);
    var fromEmail = contactEmail(from);

    Email.send({
        from: fromEmail,
        to: toEmail,
        replyTo: fromEmail || undefined,
        subject: "Filmfestplanner.com: " + from.profile.name + " wants to be your friend",
        text: msg + ' \nFollow the link to accept the friend request: ' + inviteUrl() + 'invite/' + inviteId
    });
};

var registerInvite = function (from, to) {
    var invite = {
        status: "pending",
        message: (to.message) ? to.message : "You'r friend, " + from.profile.name + ' would like to share his film festival movies with you.',
        from: {
            id: from._id,
            name: from.profile.name
        }
    };

    invite.to = {
        email: (to.email) ? to.email : void 0,
    };

    if (to.service) {
        invite.to.service = {
            type: to.service.type,
            id: to.service.id
        };
    }

    invite._id = Invites.insert(invite);
    console.log(invite);
    return invite;
};


Meteor.methods({
    getInvite: function (id) {
        console.log(id)
        return invitation = Invites.findOne({_id: id});
    },

    registerInvite: function (from, to) {
        var invite = registerInvite(from, to);
        sendInviteEmail(invite);
        return true;
    },

    registerExternalInvite: function (from, to) {
        return registerInvite(from, to);
    },

    acceptInvite: function (inviteId, friendId) {
        Invites.update({_id: inviteId}, {$set: {status: 'yes', 'to.id': friendId}});
        var invite = Invites.findOne({_id: inviteId});

        //TODO: Send accept notification

        console.log("acceptInvite: " + inviteId +" " + friendId);
        console.log(invite);

        if (invite) return makeFriends(invite.from.id, friendId);
    },

    rejectInvite: function (inviteId, friendId) {
        Invites.update({_id: inviteId}, {$set: {status: 'no', 'to.id': friendId}});

        var invite = Invites.findOne({_id: inviteId});
        if (invite) return revokeFriendship(invite.from.id, friendId);

        //TODO: Send reject notification
    },

    revokeFriendship: function (userId, friendId) {
        var invite = Invites.findOne({$or: [
            {'from.id': userId, 'to.id': friendId},
            {'from.id': friendId, 'to.id': userId}
        ]});
        if (invite) {
            Invites.update({_id: invite._id}, {status: 'no'});
        }

        //TODO: Send unfriend notification

        return revokeFriendship(userId, friendId);
    }
});