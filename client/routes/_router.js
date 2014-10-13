//****************************
//**** Router ****************
//****************************
Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    yieldTemplates: {
        'header': {to: 'header'},
        'footer': {to: 'footer'}
    },
    onBeforeAction: function(){
        Session.set('currentPath', curPath());
    },
    waitOn: function() { return Meteor.subscribe('users')}
});


Router.map(function () {
    this.route('home', {
        path: '/',
        template: 'home',
        onBeforeAction: function () {
            //AmplifiedSession.set('selected', '');
        }

    });

    this.route('profile');
    this.route('profile', {
        path: '/profile/:_id',
        data: function () {
            return Meteor.users.findOne({_id: this.params._id});
        },
        onBeforeAction: function () {
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
        onBeforeAction: function () {
            Session.set('inviteId', this.params._id);
        }
    });

    this.route('movies', {
        path: '/movies',
        template: 'movies',

        onBeforeAction: function () {
            //AmplifiedSession.set('selected', '');
            this.redirect('/movies/2013-11-06');
        }

    });

    this.route('movies', {
        path: '/movies/:date',
        template: 'movies',

        waitOn: function(){
            return Meteor.subscribe('festivals');
        },
        onBeforeAction: function () {
            // AmplifiedSession.set('selected', '');
        },
        data: function(){
            return {
                movies: Movies.find({date: this.params.date}, {sort: {'timestamp': 1}}),
                date: this.params.date,
                festival: Festivals.findOne()
            };
        },

        action: function () {
            // this.ready() is true if all items returned from waitOn are ready
            if (this.ready())
                this.render();
            else
                console.log('bing');
                //this.render('Loading');
        }
    });

    this.route('movies', {
        path: '/movies/:date/:_id',
        template: 'movies',
        onBeforeAction: function () {
             AmplifiedSession.set('selected', this.params._id);
        },
        data: function(){
            return {
                movies: Movies.find({date: this.params.date}, {sort: {'timestamp': 1}}),
                date: this.params.date,
                selected: this.params._id/*,
                festival: Festivals.findOne()*/
            };
        }
    });

    this.route('movies', {
        path: '/movies/:_id',
        template: 'movies',
        onBeforeAction: function () {
            AmplifiedSession.set('selected', this.params._id);
        }
    });



});

// Get the current path for URL
var curPath = function(){var c=window.location.pathname;var b=c.slice(0,-1);var a=c.slice(-1);if(b==""){return"/"}else{if(a=="/"){return b}else{return c}}};
