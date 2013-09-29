var log = function(msg){
  console.log(msg);
}

Meteor.sff = {};

Meteor.subscribe("movies");
Meteor.subscribe("comments");
Meteor.subscribe("cinemas");
Meteor.subscribe("userData");
Meteor.subscribe("messages");


AmplifiedSession = _.extend({}, Session, {
  keys: _.object(_.map(amplify.store(), function (value, key) {
      return [key, JSON.stringify(value)];
  })),

  set: function (key, value) {
      Session.set.apply(this, arguments);
      amplify.store(key, value);
    }
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


