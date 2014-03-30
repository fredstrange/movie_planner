'use strict'

var assert = require('assert');

suite('Message', function() {
    test('server initialization', function(done, server){
        server.eval(function(){
            var messages = Messages.find().fetch();
            emit('messages', messages);
        }).once('messages', function(messages){
            assert(messages.length == 0);
            done();
        });
    });

    test('server insert : OK', function(done, server, client) {
        server.eval(function() {
            Messages.insert({
                message: "this is a message.",
                subject: "This is the subject."
            });
            var messages = Messages.find().fetch();
            emit('messages', messages);
        }).once('messages', function(messages) {
            assert.equal(messages.length, 1);
            done();
        });

        client.once('messages', function(messages) {
            assert.equal(Messages.find().fetch().length, 1);
            done();
        });
    });


});

suite('Message2', function() {
    test('call create message method', function(done, server, client){

        console.log("createMessage0");

        client.eval(function(){
            var to, from, message, subject;

            to = {
                id: 'sender_id',
                name: 'sender name'
            };

            from = {
                id: 'receiver_id',
                name: 'receiver name'
            };

            subject = "Message subject";
            message = "Message body";

            console.log("createMessage1");

            Meteor.call('createMessage', to, from, message, subject, function(err, res){
                console.log("createMessage2");
                emit('createMessage', res);

            });
        }).once('createMessage', function(){
            assert(1==1);
            done();
        });

        server.once('createMessage', function(){
            console.log("createMessage3");
            var message = Messages.find({'to.id':'sender_id'}).fetch();
            assert(message.length == 1);

            done();
        });
    });
});