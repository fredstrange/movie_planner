var log = function(msg){
  console.log(msg);
};

Meteor.sff = {};

Festivals = new Meteor.Collection("festivals");

Meteor.subscribe("movies");
Meteor.subscribe("comments");
Meteor.subscribe("cinemas");
Meteor.subscribe("userData");
Meteor.subscribe("messages");
Meteor.subscribe("festivals");



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

    var compressed = (categorizr.isMobile || categorizr.isTablet || Session.equals('orientation', 'portrait') || ($(window).width() <= 720));
    Session.set('isCompressed', compressed);
    Session.set('width', $(window).width());

    setOverflowable();
  });

};


init();
setOverflowable();



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


Handlebars.registerHelper('isTablet', function(asCss) {
    if (asCss) return (categorizr.isTablet) ? 'isTablet' : '';
    else return categorizr.isTablet;
});

Handlebars.registerHelper('isLandscape', function(asCss) {
    if (asCss) return (Session.equals('orientation', 'landscape')) ? 'isLandscape' : 'isPortrait';
    else return Session.equals('orientation', 'landscape');
});

Handlebars.registerHelper('isTabletLandscape', function() {
    return categorizr.isTablet && Session.equals('orientation', 'landscape');
});

Handlebars.registerHelper('isMobile', function(asCss) {
    if (asCss) return (categorizr.isMobile) ? 'isMobile' : '';
    else return categorizr.isMobile;
});

Meteor.sff.isCompressed = function(){
  return (categorizr.isMobile || categorizr.isTablet || Session.equals('orientation', 'portrait') || ($(window).width() <= 720));
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


