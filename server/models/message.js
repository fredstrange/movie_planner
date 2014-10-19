var MessageUser = new SimpleSchema({
    id: {
        type: String,
        optional: false
    },
    name: {
        type: String,
        optional: false
    }
});

MessageSchema = new SimpleSchema({
    to: {
        type: MessageUser
    },
    from: {
        type: MessageUser
    },
    subject: {
        type: String,
        label: "Message subject",
        optional: true
    },
    message: {
        type: String,
        label: "Message body",
        optional: false
    },
    hasRead: {
        type: Boolean,
        label: "Message has been read",
        defaultValue: false,
        optional: false
    },
    isDeleted: {
        type: Boolean,
        label: "Message has been deleted",
        defaultValue: false,
        optional: false
    },
    createdAt: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date;
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date};
            } else {
                this.unset();
            }
        },
        denyUpdate: true
    }
});

Messages = new Meteor.Collection('messages', {schema: MessageSchema});


    Messages.allow({
    insert: function (userId, comment) {
        return true;
    },
    remove: function (userId, comment) {
        return false;
    },
    update: function (userId, comment) {
        return true;
    }
});