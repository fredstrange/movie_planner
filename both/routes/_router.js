//****************************
//**** Router ****************
//****************************



var defaultDate = '2014-11-05';



var getDate = function(params){
    var date = (params && params.query && params.query.date)? params.query.date : (AmplifiedSession.get('selectedDate'))? AmplifiedSession.get('selectedDate') : defaultDate;
    AmplifiedSession.set('selectedDate', date);

    return date;
};

var getMovie = function(params){
    var movie = (params && params.query && params.query.movie)? params.query.movie : AmplifiedSession.get('selected');
    AmplifiedSession.set('selected', movie);

    return movie;
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
    },
    {
        name: 'home'
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


Router.route('/schedule', {
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
            festival: Festivals.findOne(),
            userId: userId
        };
    },

    action: function() {
        this.render('schedule');
    }
});


Router.route('/movies/', {
    onBeforeAction: function(){
        this.next();
    },

    data: function(){
        var date = getDate(this.params);
        var selected = getMovie(this.params);

        return {
            movies: Movies.find({date: date}, {sort: {'timestamp': 1}}),
            date: date,
            festival: Festivals.findOne(),
            selected: Movies.findOne({_id: selected})
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

Router.route('about', function(){
    this.render('about');
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
