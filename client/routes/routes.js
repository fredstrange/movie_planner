Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',

    onBeforeAction: function(){
        Session.set('currentPath', this.location.path);
        this.render('header', {to: 'header'});
        this.render('footer', {to: 'footer'});
        this.next();
    },
    waitOn: function() { return Meteor.subscribe('users')}
});

var defaultDate = '2014-11-05';

Router.utils = {
    getDate: function(params){
        var date = (params && params.query && params.query.date)? params.query.date : (AmplifiedSession.get('selectedDate'))? AmplifiedSession.get('selectedDate') : defaultDate;
        AmplifiedSession.set('selectedDate', date);

        return date;
    },

    getMovie: function(params){
    var movie = (params && params.query && params.query.movie)? params.query.movie : AmplifiedSession.get('selected');
    AmplifiedSession.set('selected', movie);

    return movie;
    }
};

/*
 var renderQueryParams = function(params){

 if(!params) return '';

 return _.reduce(params.query, function(result, value, key){
 if(_.isEmpty(result)) result = '?';
 else result += '&';

 result += key + '=' + value;
 return result;
 }, '');

 };

 // Get the current path for URL
 var curPath = function(){var c=window.location.pathname;var b=c.slice(0,-1);var a=c.slice(-1);if(b==""){return"/"}else{if(a=="/"){return b}else{return c}}};

 */