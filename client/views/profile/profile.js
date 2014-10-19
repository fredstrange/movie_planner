var sendInvitation = function (email, message) {
    var to = {
        email: email,
        message: message
    };

    Meteor.call('registerInvite', Meteor.user(), to, function (err, rtn) {
        console.log(err);
        console.log(rtn);
    });
};

Template.profile.helpers({
    userImage: function () {
        return Session.get('userImage');
    },

    displayName: function () {
        var user = Meteor.users.findOne({_id: this._id});
        return displayName(user);
    },

    myFriends: function () {
        var friends = getFriends();
        return friends;
    },

    isTwitter: function () {
        return Meteor.sff.userService() == 'twitter';
    },

    isFacebook: function () {
        return Meteor.sff.userService() == 'facebook';
    },

    isGoogle: function () {
        return Meteor.sff.userService() == 'google';
    },

    isNative: function () {
        return Meteor.sff.userService() == 'native';
    }


});


Template.profile.rendered = function () {
    $(window).scrollTop(0);
};


Template.profile.created = function () {

    var id = Session.get('profileId');
    id = (id) ? id : Meteor.userId();

    Meteor.call('userImage', id, location.host, function (err, uri) {
        Session.set('userImage', uri);
    });

    Meteor.call('userService', function (err, result) {
        Session.set('userService', result);
    });


};



Template.profile.events({
    'click .saveProfileBtn': function () {
        var username = $('#username').val();
     //   var email = $('#email').val();

        Meteor.users.update(this._id, {$set: {'profile.name': username}});
    },
    'click #inviteSubmit': function () {
        var email = $('#inviteEmail').val(),
            message = $('#inviteMessage').val()

        if (email) {
            if (Meteor.utils.validateEmail(email)) {
                console.log(email);
                sendInvitation(email, message);
            } else {
                console.log("invalid email");
            }
        } else {
            console.log('no email');
        }
    }
});



