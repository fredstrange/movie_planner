Template.header.helpers({
	numNewMessages: function(){
		var numMessages = Messages.find({'to.id': Meteor.userId(), hasRead: false}).count();
		return (numMessages > 0 )? numMessages : "";
	}
});

Template.header.events({});

