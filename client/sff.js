var log = function(msg){
  console.log(msg);
}

Meteor.subscribe("movies");
Meteor.subscribe("userData");





if (Meteor.isClient) {
 
  Router.map(function() { 
    this.route('home', {path: '/'});
    this.route('profile');
  });

  Template.hello.greeting = function () {
    return "Welcome to sff.";
  };

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });

}

Template.movieList.movies = function () {
  return Movies.find({});
};

Template.movieDetails.movie = function () {
  return Movies.findOne(Session.get("selected"));
};

Template.movieDetails.maybeChosen = function (what) {
  var myAttendance = _.find(this.attendings, function (a) {
    return a.user === Meteor.userId();
  }) || {};

  return what == myAttendance.attending ? "chosen btn-inverse" : "";
};

Template.movieDetails.events({
  'click .rsvp_yes': function () {
    Meteor.call("attending", Session.get("selected"), "yes");
    return false;
  },
  'click .rsvp_maybe': function () {
    Meteor.call("attending", Session.get("selected"), "maybe");
    return false;
  },
  'click .rsvp_no': function () {
    Meteor.call("attending", Session.get("selected"), "no");
    return false;
  },
});

Template.embededMovieDetails.isSelected = function (id) {
  return Session.get("selected") == id ? "" : "hidden";
};

Template.embededMovieDetails.maybeChosen = function (what) {
  var myAttendance = _.find(this.attendings, function (a) {
    return a.user === Meteor.userId();
  }) || {};

  return what == myAttendance.attending ? "chosen btn-inverse" : "";
};

Template.embededMovieDetails.events({
  'click .rsvp_yes': function (event) {
    Meteor.call("attending", Session.get("selected"), "yes");
    return false;
  },
  'click .rsvp_maybe': function () {
    Meteor.call("attending", Session.get("selected"), "maybe");
    return false;
  },
  'click .rsvp_no': function () {
    Meteor.call("attending", Session.get("selected"), "no");
    return false;
  },
});

Template.embededMovieDetails.rendered = function() {
  var id = $(this.find('.embededMovieDetails')).attr('movie');
  if(id == Session.get('selected')) return;

  $('.embededMovieDetails').hide();
}


Template.movieRow.attending = function(){
  return attendingMovie(this);
};

Template.movieRow.friendsAttending = function(){
  return friendsAttendingMovie(this);
};

Template.movieRow.goingRowColor = function(){
  var myAttendance = _.find(this.attendings, function (a) {
    return a.user === Meteor.userId();
  }) || {};

  return (myAttendance.attending) ? myAttendance.attending + 'Going' : '';
};

Template.movieRow.events({
  'click .movieRow' : function (event) {

    $('.embededMovieDetails').hide(300);
    var id = event.currentTarget.id;
    if(id == Session.get('selected')) return;

    Session.set("selected", id);
    $('#embededMovieDetails-' + id).show(300);


    return false;
  }
});


Template.profile.events({
  'click .saveProfileBtn' : function(){
      var username = $('#username').val();
      var email = $('#email').val();

      Meteor.users.update(this._id, {$set:{'profile.name': username}});
  }
});


Template.profile.friendsName = function(){
 // console.log(this.toString());
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


