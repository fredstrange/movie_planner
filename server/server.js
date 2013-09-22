
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
	var friends =(fromUser) ? fromUser : [];
	friends.push(this.userId);

  	return Meteor.users.find({_id: {$in: friends}}, {fields: {'friends': 1, 'profile': 1, 'services':1}});                          
});

/*
Meteor.publish('invitations', function(){
	var user = Meteor.users.findOne({_id: this.userId})
	if(!user) return;
	return Invitations.find({})
});
*/

Meteor.methods({

	userImage: function(){
		var user, imageURL, id;

		id = Meteor.userId(); 
		user = Meteor.users.findOne({ _id: id });

		if(user && user.services){
			if(user.services.twitter){
				imageURL = user.services.twitter.profile_image_url;
			}else if(user.services.facebook){
				imageURL = 	"http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
			}else if (user.services.google){
				imageURL = "https://plus.google.com/s2/photos/profile/" + user.services.google.id + "?sz=200";
			}
			
		}

		return imageURL;
	},

	getinvite: function(id){
		return invitation = Invitations.findOne({_id: id});
	},

	registerInvite: function(from, to, message){
		var invite = {
			status: "pending",
			message: (to.message) ?  to.message : "You'r friend, " + from.profile.name + ' would like to share his film festival movies with you.',
			from: {
				id: from._id,
				name: from.profile.name
			}
		};

		invite.to = {
			email: (to.email) ?  to.email : void 0,
		};

		if(to.service){
			invite.to.service = {
				type: to.service.type,
				id: to.service.id
			};
		}

		console.log(invite)

		return Invites.insert(invite);
	},

	acceptInvite: function(id){
		Invites.update({_id:id}, {$set: {status:'yes'}});
		var invite = Invites.findOne({_id:id});
	//	Users.update()


	},

	rejectInvite: function(id){
		Invites.update({_id:id}, {$set: {status:'no'}});
	}
});










/*

Schema for internal referance. 

Movie = {
	title: string,
	description: string,
	Cinema: {
		name:string,
		id:string
	},
	time: unix timestamp,
	trailer: string (url),
	duration: number,
	attendings: [{ 	//array of rsvp objects.
		attending: string (yes, no, maybe),
		user: string (userId)
	}],
	clashing:[movie ids],
}

Comment = {
	body: string,
	user: string (id),
	movieid: string (id),
	parentid: string (id),
	timestamp: timestamp
}

User = {
	...,
	friends: [], //array of user ids
	profile: {
		name: string // is use for the username and display name. 
	}	
}

Cimena = {
	name: string,
	coordinates: {
		x: number,
		y: number
	},
	distances: [{
		cinema: string (cinema id),
		distance: number (distance in meters),
		time: Number (time to walk to the cinema)
	}]
}

Invitation = {
	from: {
		id: string (id),
		name: string
	},
	to: {
		email: string,
		service: {
			type: string (google, facebook, twitter, native),
			id: string	(id)
		}
	},
	status: string (pending, yes, no),
	message: string,
}

*/