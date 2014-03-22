Template.message.helpers({
	unread: function(){
		return (Session.get('unread_' + this._id))? 'unread': '';
	},
	createdAgo: function(){
		return moment(this.createdAt).fromNow();
	}
});

Template.message.events({
	'click .message-mark-as-read-btn': function(){
		Session.set('unread_' + this._id, false);
		Messages.update({_id: this._id}, {$set: {hasRead: true}}); 
	},
	'click .message-mark-as-unread-btn': function(){
		Session.set('unread_' + this._id, true);
		Messages.update({_id: this._id}, {$set: {hasRead: false}}); 
	}
})

Template.message.rendered = function(){
	if(this.data.hasRead == false){
		Session.set('unread_' + this.data._id, true);
		//Messages.update({_id: this.data._id}, {$set: {hasRead: true}}); 
	}

	$(window).scrollTop(0);
}


