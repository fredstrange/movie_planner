var log = function(msg){
  console.log(msg);
};

Meteor.sff = {};
//if(Meteor.settings === void 0) Meteor.settings = {"public" : { "disqus": { "shortname": "filmfestplanner" } } };


Festivals = new Meteor.Collection("festivals");
Messages = new Meteor.Collection('messages');

Meteor.subscribe("movies");
Meteor.subscribe("comments");
Meteor.subscribe("cinemas");
Meteor.subscribe("userData");
Meteor.subscribe("messages");
Meteor.subscribe("festivals");


Flash.config.timeout = 5000;

AmplifiedSession = _.extend({}, Session, {
  keys: _.object(_.map(amplify.store(), function (value, key) {
      return [key, JSON.stringify(value)];
  })),

  set: function (key, value) {
      Session.set.apply(this, arguments);
      amplify.store(key, value);
    }
});


var setOverflowable = function(){
  var compressed = Session.get('isCompressed');
  if(compressed){
      $('html').removeClass('overflowable');
    }else{
      $('html').addClass('overflowable');
    }
};




init = function(){
  console.log('init');
  $( window ).on( "orientationchange", function( event ) {
    var winWidth = $(window).width();
    var winHeight = $(window).height();
    var orientation = (winHeight < winWidth)? 'landscape' : 'portrait';

    Session.set('orientation', orientation);
    Session.set('width', $(window).width());
//    console.log('orientation has changed', event.orientation);
  });

  $( window ).orientationchange();

  $( window ).resize(function() {

    var compressed = (Session.equals('orientation', 'portrait') || ($(window).width() <= 720));
    Session.set('isCompressed', compressed);
    Session.set('width', $(window).width());

    setOverflowable();
  });

};

var trackSelectedChange = function(){
    Tracker.autorun(function() {
        var selected = AmplifiedSession.get('selected');

        var movie, myAttendance = "";

        movie = Movies.findOne(AmplifiedSession.get("selected"));

        if (movie && movie.attendings) {
            myAttendance = _.find(movie.attendings, function (a) {
                return a.user === Meteor.userId();
            }) || {};
        }

        AmplifiedSession.set('attendingSelected', myAttendance.attending);
    });
};


init();
setOverflowable();
trackSelectedChange();


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
};

//****************************************
//******** Account stuff *****************
//****************************************

/*

Handlebars.registerHelper('isTablet', function(asCss) {
    if (asCss) return (categorizr.isTablet) ? 'isTablet' : '';
    else return categorizr.isTablet;
});
*/

Handlebars.registerHelper('isLandscape', function(asCss) {
    if (asCss) return (Session.equals('orientation', 'landscape')) ? 'isLandscape' : 'isPortrait';
    else return Session.equals('orientation', 'landscape');
});
/*

Handlebars.registerHelper('isTabletLandscape', function() {
    return categorizr.isTablet && Session.equals('orientation', 'landscape');
});
*/
/*

Handlebars.registerHelper('isMobile', function(asCss) {
    if (asCss) return (categorizr.isMobile) ? 'isMobile' : '';
    else return categorizr.isMobile;
});
*/

Meteor.sff.isCompressed = function(){
  return ( Session.equals('orientation', 'portrait') || ($(window).width() <= 720));
}

Handlebars.registerHelper('isCompressed', function() {
    return Session.get('isCompressed');
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


