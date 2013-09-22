Template.postcomment.events({
	'click .comment-submit': function(event, tmpl){
		var body, timestamp, userid, name, parentid, movieid;

		body = $(tmpl.find('.comment-post-body')).val();
		parentid = $(tmpl.find('.comment-parnetid')).val();
		timestamp = new Date().getTime();
		userid = Meteor.userId();
		name = Meteor.user().profile.name;
		movieid = this._id;

		if(body){
			Comments.insert({
				body: body,
				user: {
					id: userid,
					name: name
				},
				movieid: movieid,
				parentid: parentid,
				timestamp: timestamp
			});
			$(tmpl.find('.comment-post-body')).val("");
		}

	}
})