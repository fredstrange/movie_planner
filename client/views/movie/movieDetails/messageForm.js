Template.messageForm.helpers({});

Template.messageForm.events({
	'click #message-submit': function(event, tepl){
        var formTo, formSubject, formMessage, to, from;

		formTo = $('#message-to')
		formSubject = $('#message-subject').val();
        formMessage = $('#message-message').val();
		
		to = {
			id: formTo.select2('val'),
			name: formTo.select2('data').text
		};

		from = {
			id: Meteor.userId(),
			name: Meteor.user().profile.name
		};

		if(to.id && message){
			Meteor.call('createMessage', to, from, formMessage, formSubject, function(err, res){
				if(err) console.log(err);
			});
		}

		$('#message-to').select2('val', '');
		$('#message-subject').val('');
		$('#message-message').val('');
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