

Template.invite.helpers({

});

Template.invite.events({
	'click .accept': function(){
		Meteor.call('acceptInvite', this.data._id);
	},
	'click .reject': function(){
		Meteor.call('rejectInvite', this.data._id);
	}
});
