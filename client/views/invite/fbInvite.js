Template.fbInvite.rendered = function () {
    // This is to make sure that the facebook popup closes itself when the send dialog is complete.
    if (Meteor.utils.getParameterByName('success') == 1) {
        window.close();
    }

    Tracker.autorun(function(){

        var data =  AmplifiedSession.get('facebookFriends');

        var optionData = _.map(data, function (item) {
            item.text = item.name;
            return item;
        });

        $("#fb-friends").select2({
            placeholder: "Select a friend to invite",
            allowClear: true,
            width: 200,
            data: { results: optionData, text: 'name' }
        });
    });
};

Template.fbInvite.helpers({
});

Template.fbInvite.events({
    'click .fb-invite-submit': function (event, tmpl) {
        var friendId = $("#fb-friends").val();
        var to = {
            service: {
                type: 'facebook',
                id: friendId
            }
        };

        Meteor.call('registerExternalInvite', Meteor.user(), to, function (err, res) {

            var invite = res;

            console.log(res);
            if (!err) console.log('Invite registered');



            Meteor.call('getFacebookAppId', function (err, res) {
                var rootURL = (location.host == 'localhost:3000') ? 'www.filmfestplanner.com' : location.host;
                var url = 'https://www.facebook.com/dialog/send?' +
                    '&app_id=' + res +
                    '&to=' + friendId +
                    '&link=' + 'http://' + rootURL + '/invite/' + invite._id +
                    '&redirect_uri=' + location.href;

                window.open(url, 'facebook-invite-dialog', 'width=800,height=500');
            });

            Flash.success('Your invite has been sent!')


        });


    }
});