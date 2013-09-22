var log = function(msg){
  console.log(msg);
}

Meteor.sff = {};

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

    this.route('profile');
    this.route('adminView');
    this.route('schedule');
    this.route('schedule', {
      path: '/schedule/:_id',
      data: function(){
        return {id: this.params._id};
      }
    });

    this.route('invite', {
      path: '/invite/:_id', 
      template: 'invite',
      onBeforeRun: function(){
        Session.set('inviteId', this.params._id);
      }
    });

    this.route('movie', {
      path: '/:_id', 
      template: 'home',
      onBeforeRun: function(){
        AmplifiedSession.set('selected', this.params._id);

      }
    });

  });

  init = function(){
    console.log('init');
  }

  init();



//****************************************
//******** Global Methods ****************
//****************************************



Meteor.sff.userService = function(){
  var user = Meteor.user();
  if(user && user.services){
    if(user.services.twitter){
      return "twitter";
    }else if(user.services.facebook){
      return "facebook";
    }else if (user.services.google){
      return "google";
    }else{
      return "native";
    }
    
  }else{
    return "";
  }
}

//****************************************
//******** Account stuff *****************
//****************************************


Accounts.ui.config({
  requestPermissions: {
    facebook: []
  },
  requestOfflineToken: {
    google: true
  },
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});




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


