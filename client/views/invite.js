var getInvite = function(){
	var inviteId = Session.get('inviteId');
	if(inviteId){
		Meteor.call('getInvite', inviteId, function(err, result){
			if(err) console.log('Failed to retrive invite');
			else{
				if(result.status === 'pending'){
					Session.set('invite', result);
				}else{
					Router.go('home');
				}
			}
		});
	}
};


Template.invite.helpers({
	validInvite: function(){
		return (Session.get('invite'));
	},

	inviterName: function(){
		var invite = Session.get('invite');
		return (invite)? invite.from.name : "unknown";
	}
});

Template.invite.events({
	'click .acceptInvite': function(){
		var invite = Session.get('invite');
		if(!invite) return false;

		Meteor.call('acceptInvite', invite._id, Meteor.userId(), function(err, result){
			if(err){
				console.log('AcceptInvite failed.');
				console.log(err);
			}else{
				console.log('AcceptInvite complete.');
				Session.set('invite', void 0);
				Router.go('home');
			}
		});
	},
	'click .rejectInvite': function(){
		var invite = Session.get('invite');
		if(!invite) return false;

		Meteor.call('rejectInvite', invite._id, Meteor.userId(), function(err, result){
			if(err){
				console.log('rejectInvite failed.');
				console.log(err);
			}else{
				console.log('rejectInvite complete.');
				Session.set('invite', void 0);
				Router.go('home');
			}
		});
	}
});

Template.invite.rendered = function(){
	getInvite();
}
