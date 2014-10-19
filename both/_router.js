//****************************
//**** Router ****************
//****************************


Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',

    onBeforeAction: function(){
        Session.set('currentPath', this.location.path);
        this.render('header', {to: 'header'});
      //  this.render('footer', {to: 'footer'});
        this.next();
    },
    waitOn: function() { return Meteor.subscribe('users')}
});

var getDate = function(params){
    var date = (params && params.date)? params.date : (AmplifiedSession.get('selectedDate'))? AmplifiedSession.get('selectedDate') : '2014-11-05';
    AmplifiedSession.set('selectedDate', date);

    return date;
};

var renderQueryParams = function(params){

    if(!params) return '';

    return _.reduce(params.query, function(result, value, key){
        if(_.isEmpty(result)) result = '?';
        else result += '&';

        result += key + '=' + value;
        return result;
    }, '');

};


Router.route('/', function () {
    this.render('home');
});

Router.route('profile', function () {
    this.render('profile');
});

Router.route('/profile/:_id', {

    data: function () {
        return Meteor.users.findOne({_id: this.params._id});
    },

    onBeforeAction: function () {
        Session.set('profileId', this.params._id);
        this.next();
    },

    action: function(){
        this.render('profile');
    }

});

Router.route('/adminView', function(){
    this.render('adminView');
});


Router.route('/schedule', function(){
    this.redirect('/schedule/' + getDate() + renderQueryParams(this.params));
});

Router.route('/schedule/:date', {
    onBeforeAction: function(){
        this.next();
    },

    data: function(){
        var date = getDate(this.params);
        var userId = (_.isEmpty(this.params.query.user))? Meteor.userId() : this.params.query.user;
        var movies = Movies.find({date: date, 'attendings.user': userId, 'attendings.attending': 'yes'}, {sort: {'timestamp': 1}}).fetch();

        return {
            movies: movies,
            date: date,
            userId: userId
        };
    },

    action: function(){
        this.render('schedule');
    }
});

Router.route('/movies', function(){
    this.redirect('/movies/' + getDate() + renderQueryParams(this.params));
});

Router.route('/movies/:date', {
    onBeforeAction: function(){
        this.next();
    },

    data: function(){
        var date = getDate(this.params);

        return {
            movies: Movies.find({date: date}, {sort: {'timestamp': 1}}),
            date: date,
            festival: Festivals.findOne()
        };
    },

    action: function () {
        this.render('movies');
    }
});


Router.route('/movies/:date/:id', {
    onBeforeAction: function () {

        AmplifiedSession.set('selectedDate', this.params.date);
        AmplifiedSession.set('selected', this.params._id);
        this.next();
    },

    data: function(){
        return {
            movies: Movies.find({date: this.params.date}, {sort: {'timestamp': 1}}),
            date: this.params.date,
            selected: this.params._id,
            festival: Festivals.findOne()
        };
    },

    action: function () {
        this.render('movies');
    }
});

Router.route('/invite/:_id', {
    onBeforeAction: function () {
        Session.set('inviteId', this.params._id);
        this.next();
    },

    action: function () {
        this.render('invite');
    }

});




Router.map(function () {

    this.route('movies_id', {
        path: '/movies/:_id',
        template: 'movies',
        onBeforeAction: function () {
            AmplifiedSession.set('selected', this.params._id);
        }
    });



});

// Get the current path for URL
var curPath = function(){var c=window.location.pathname;var b=c.slice(0,-1);var a=c.slice(-1);if(b==""){return"/"}else{if(a=="/"){return b}else{return c}}};
