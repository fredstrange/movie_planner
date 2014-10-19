Template.message.helpers({
	unread: function(){
		return (this.hasRead)? '': 'unread';
	},
	createdAgo: function(){
		return moment(this.createdAt).fromNow();
	}
});

Template.message.events({
	'click .message-mark-as-read-btn': function(){
		Messages.update({_id: this._id}, {$set: {hasRead: true}}); 
	},
	'click .message-mark-as-unread-btn': function(){
		Messages.update({_id: this._id}, {$set: {hasRead: false}}); 
	},
	'click .message-delete-btn': function(){
		Messages.update({_id: this._id}, {$set: {isDeleted: true}});
	}
});

Template.message.rendered = function(){
	$(window).scrollTop(0);
};


