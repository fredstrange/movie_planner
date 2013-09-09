Template.profile.userImage = function(){
	return Session.get('userImage');
};

Template.profile.rendered = function(){
	Meteor.call('userImage', function(err, uri){
		Session.set('userImage', uri); 
	});
}