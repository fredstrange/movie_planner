Template.messageForm.helpers({});

Template.messageForm.events({
	'click #message-submit': function(event, tepl){
        event.preventDefault();

        var message = messageObjFromForm($('#messageForm'));

        Meteor.call('createMessage', message, function(error, res){
            if(error) console.log(error);
        });

		clearForm();
	}
});

Template.messageForm.rendered = function(){
    var friends, formatedFriends;

	friends = getFriends().fetch();
	formatedFriends = _.map(friends, function(item){
		return {
			id: item._id,
			text: item.profile.name
		}
	});

	$('#message-to').select2({
		placeholder: "Select a friend",
        allowClear: true,
        width: 200,
        data: formatedFriends
	});
};

/**********************************************
/**********View Controller methods*************
/*********************************************/


var clearForm = function(){
    $('#message-to').select2('val', '');
    $('#message-subject').val('');
    $('#message-message').val('');
};

var messageObjFromForm = function($form){
    return {
        to: {
            id: $form.find('#message-to').select2('val'),
            name: $form.find('#message-to').select2('data').text
        },
        from: {
            id: Meteor.userId(),
            name: Meteor.user().profile.name
        },
        subject: $form.find('#message-subject').val(),
        message: $form.find('#message-message').val()
    };
};

