/*

There is currently no concept of schema for Meteor. 
The document is only for development referance. 

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
		lat: number,
		lng: number
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
		id: string (id)
		email: string,
		service: {
			type: string (google, facebook, twitter, native),
			id: string	(id)
		}
	},
	status: string (pending, yes, no),
	message: string,
}

Message = {
	to: {
		id: string (id),
		name: string
	},
	from: {
		id: string (id),
		name: string
	},
	parentId: string (id),
	subject: string,
	message: string,
	hasRead: boolean,
	created: timestamp
}




*/