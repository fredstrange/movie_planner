Meteor.publish("messages", function () {
    return Messages.find({$or: [
        {'to.id': this.userId},
        {'from.id': this.userId}
    ]});
});

Meteor.methods({
    createMessage: function (to, from, message, subject) {
        var message = {
            to: to,
            from: from,
            message: message,
            createdAt: new Date().getTime(),
            hasRead: false,
            subject: (subject) ? subject : ''
        };
        Messages.insert(message);
    }
});