Template.messageForm.helpers({

});

Template.messageForm.events({
	'click #message-submit': function(event, tepl){
		var $to = $('#message-to')
		var subject = $('#message-subject').val();
		var message = $('#message-message').val();
		
		var to = {
			id: $to.select2('val'),
			name: $to.select2('data').text
		}

		var from = {
			id: Meteor.userId(),
			name: Meteor.user().profile.name
		}


		if(to.id && message){
			Meteor.call('createMessage', to, from, message, subject, function(err, res){
				if(err) console.log(err);
				//else console.log(res);
			});
		}

		$('#message-to').select2('val', '');
		$('#message-subject').val('');
		$('#message-message').val('');
			
	}
});

Template.messageForm.rendered = function(){
	var friends = getFriends().fetch();
	var formatedFriends = _.map(friends, function(item){
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