Meteor.publish("messages", function () {
    return Messages.find(
        {
            $and:[
                {$or: [
                    {'to.id': this.userId},
                    {'from.id': this.userId}
                ]},
                {isDeleted: {$ne: true}}
            ]
        }
    );
});

Meteor.methods({
    createMessage: function (message, callback) {
        console.log('createMessage ss');
        var error = [];
        if(_.isEmpty(message.to.id)) error.push({type: 'validationError', message: 'The to id is not set'});
        if(_.isEmpty(message.to.name)) error.push({type: 'validationError', message: 'The to name is not set'});
        if(_.isEmpty(message.message)) error.push({type: 'validationError', message: 'The message is empty of void'});
        if(_.isEmpty(message.from.id)) error.push({type: 'validationError', message: 'The from id is not set'});
        if(_.isEmpty(message.from.name)) error.push({type: 'validationError', message: 'The from name is not set'});
        if(_.isNaN(message.createdAt)) error.push({type: 'validationError', message: 'The creation date is not valid'});

        if(error.length > 0){
            callback(error);
            return;
        }

        message.hasRead = false;
        message.createdAt = new Date();

        Messages.insert(message, function(err){
            if(err) {
                error.push(err)
                callback(error);
            }
        });
    }
});