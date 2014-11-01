Router.route('profile', {
    action: function(){
        this.render('profile');
    },

    onAfterAction: function(){
        if(Meteor.user().services && Meteor.user().services.facebook){
            Meteor.call('getFriendsData', function (err, res) {
                if (err) console.log(err);
                else if (res) {
                    AmplifiedSession.set('facebookFriends', res.data);
                }else{

                }
            });
        }
    }
});

Router.route('/profile/:_id', {

    data: function () {
        return Meteor.users.findOne({_id: this.params._id});
    },

    onBeforeAction: function () {
        Session.set('profileId', this.params._id);
        this.next();
    },

    action: function(){
        this.render('profile');
    }

});