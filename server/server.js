
Meteor.publish("movies", function () {
  return Movies.find({}, {sort: {'time': 1}});
});

Meteor.publish("comments", function () {
  return Comments.find({});
});

Meteor.publish("cinemas", function () {
  return Cinemas.find({});
});

Meteor.publish("userData", function () {
	if(!Meteor.users.findOne({_id: this.userId})) return;
	var fromUser = Meteor.users.findOne({_id: this.userId},  {fields: {'friends': 1, 'profile': 1 }} ).friends;
	var friends = (fromUser) ? fromUser : [];
	friends.push(this.userId);

  	return Meteor.users.find({_id: {$in: friends}}, {fields: {'friends': 1, 'profile': 1, 'services':1}});                          
});


Meteor.methods({

	userImage: function(userId, host){
		var user, imageURL, id, params;
        console.log("user image");

		id = (userId)? userId : Meteor.userId(); 
		user = Meteor.users.findOne({ _id: id });


		
		if(user && user.services){

			if(user.services.twitter){
				imageURL = user.services.twitter.profile_image_url;
			}else if(user.services.facebook){
				imageURL = 	"http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
			}else if (user.services.google){
				imageURL = "https://plus.google.com/s2/photos/profile/" + user.services.google.id + "?sz=200";
			}else{
				var defaultHost = (host == 'localhost:3000')? 'filmfestplanner.com' : host;

				params = {
					secure: false, // https ?
					d: encodeURIComponent('http://' + defaultHost + '/default.png'), 
					s: 200, // size
					r: 'pg' // rating
				};
				imageURL = Gravatar.urlFromEmail(user.emails[0].address, params);	
			}
		}

		return imageURL;
	}
});


