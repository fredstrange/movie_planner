Template.messageList.helpers({
    showMessageForm: function(){
        return AmplifiedSession.equals('showMessageForm', true);
    }
});

Template.messageList.events({
    'click #message-form-hide': function(){
        AmplifiedSession.set('showMessageForm', false);
    },
    'click #message-form-show': function(){
        AmplifiedSession.set('showMessageForm', true);
    }
});