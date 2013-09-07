var log = function(msg){
  console.log(msg);
}

Meteor.subscribe("movies");
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


