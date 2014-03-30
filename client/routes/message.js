Router.map(function(){
    this.route('message');
    this.route('messages');
});


MessageController = RouteController.extend({
    path: '/message/:_id',
    template: 'message',
    data: function () {
        Messages.find({_id: this.params._id});
    }
});

MessagesController = RouteController.extend({
    path: '/messages',
    template: 'messageList',
    data: function () {
        var messages = Messages.find({'to.id': Meteor.userId()}, {sort: {_id: -1}});
        var unRead = [];

        messages.forEach(function (message) {
            if (message.hasRead == false) unRead.push(message._id);
        });

        return {
            messages: messages,
            unRead: unRead
        };
    }
});


