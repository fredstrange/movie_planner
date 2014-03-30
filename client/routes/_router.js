//****************************
//**** Router ****************
//****************************
Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    yieldTemplates: {
        'header': {to: 'header'},
        'footer': {to: 'footer'}
    }
});


Router.map(function () {
    this.route('home', {
        path: '/',
        template: 'home',
        before: function () {
            AmplifiedSession.set('selected', '');
        }

    });

    this.route('profile');
    this.route('profile', {
        path: '/profile/:_id',
        data: function () {
            return Meteor.users.findOne({_id: this.params._id});
        },
        before: function () {
            Session.set('profileId', this.params._id);
        }
    });
    this.route('adminView');

    this.route('schedule');
    this.route('schedule', {
        path: '/schedule/:_id',
        data: function () {
            return {id: this.params._id};
        }
    });

    this.route('invite', {
        path: '/invite/:_id',
        template: 'invite',
        before: function () {
            Session.set('inviteId', this.params._id);
        }
    });
/*
    this.route('messages', {
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

    this.route('message', {
        path: '/message/:_id',
        template: 'message',
        data: function () {
            Messages.find({_id: this.params._id});
        }
    });*/

    this.route('movies', {
        path: '/movies',
        template: 'movies',
        before: function () {
            AmplifiedSession.set('selected', '');
        }

    });

    this.route('movies', {
        path: '/movies/:_id',
        template: 'movies',
        before: function () {
            AmplifiedSession.set('selected', this.params._id);
        }
    });

});