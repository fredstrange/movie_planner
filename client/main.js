var log = function(msg){
  console.log(msg);
}

Meteor.subscribe("movies");
Meteor.subscribe("comments");
Meteor.subscribe("cinemas");
Meteor.subscribe("userData");


AmplifiedSession = _.extend({}, Session, {
  keys: _.object(_.map(amplify.store(), function (value, key) {
      return [key, JSON.stringify(value)];
  })),

  set: function (key, value) {
      Session.set.apply(this, arguments);
      amplify.store(key, value);
    }
});



//****************************
//**** Router ****************
//****************************
  Router.configure({
    layout: 'layout',
    loadingTemplate: 'loading',
    renderTemplates: {
        'footer': {to: 'footer'},
        'header': {to: 'header'}
      }
  })



  Router.map(function() { 
    this.route('home', {
      path: '/', 
      template: 'home',
      renderTemplates: {
        'footer': {to: 'footer'},
        'header': {to: 'header'}
      }
    });

    this.route('movie', {
      path: '/:_id', 
      template: 'home',
      onBeforeRun: function(){
        AmplifiedSession.set('selected', this.params._id);
      }
    });


    this.route('profile');
    this.route('schedule');
    this.route('adminView');
  });

  init = function(){
    console.log('init');
  }

  init();



Template.movieList.movies = function () {
  return Movies.find({});
};






Template.profile.events({
  'click .saveProfileBtn' : function(){
      var username = $('#username').val();
      var email = $('#email').val();

      Meteor.users.update(this._id, {$set:{'profile.name': username}});
  }
});


Template.profile.friendsName = function(){
  var user = Meteor.users.findOne(this.toString());
  return displayName(user);
};















if (Meteor.isServer) {
  Meteor.startup(function () {
    log('bing');
    Meteor._debug('test');

    if(Movies.find({}).count() === 0){

      log('Movies is empty');
      var movies = {};
      movies = JSON.parse(Assets.getText("movies.json"));
        Movies.insert({titel:'test'});
      _.each(movies.initMovies, function(movie){
        Movies.insert(movie);
      });
    }
  });
}


// Get the current path for URL
var curPath=function(){var c=window.location.pathname;var b=c.slice(0,-1);var a=c.slice(-1);if(b==""){return"/"}else{if(a=="/"){return b}else{return c}}};

Handlebars.registerHelper('active', function(path) {
    return curPath() == path ? 'active' : '';
});


Handlebars.registerHelper("debug", function(optionalValue) { 
  console.log("Current Context");
  console.log("====================");
  console.log(this);

  if (optionalValue) {
    console.log("Value"); 
    console.log("===================="); 
    console.log(optionalValue); 
  } 
});


