Template.movieDetails.movie = function () {
  return Movies.findOne(AmplifiedSession.get("selected"));
};

Template.movieDetails.maybeChosen = function (what) {
  var myAttendance = _.find(this.attendings, function (a) {
    return a.user === Meteor.userId();
  }) || {};

  return what == myAttendance.attending ? "chosen btn-inverse" : "";
};

Template.movieDetails.rendered = function() { 
  var mapOptions, canvas, id, movie, cinema, lat, lng;

  //$('#detailsColumn').scrollToFixed({marginTop: 10, marginRight:10});
  
  canvas = $("#map-canvas")[0];
  id = AmplifiedSession.get('selected');
  movie = Movies.findOne({_id:  id});

  cinema = (movie)? Cinemas.findOne({name:movie.cinema}) : void 0;
  if(!canvas || !cinema) return;

  lat = cinema.coordinates.lat;
  lng = cinema.coordinates.lng;
   
  mapOptions = {
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  };

  map = new google.maps.Map(canvas, mapOptions); 

  map.setCenter(new google.maps.LatLng(lat, lng));
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(lat, lng),
    title: cinema.name,
    icon:'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
  });
  marker.setMap(map);   

  //Session.set('map', true);
};

Template.movieDetails.events({
  'click .rsvp_yes': function () {
    Meteor.call("attending", AmplifiedSession.get("selected"), "yes");
    return false;
  },
  'click .rsvp_maybe': function () {
    Meteor.call("attending", AmplifiedSession.get("selected"), "maybe");
    return false;
  },
  'click .rsvp_no': function () {
    Meteor.call("attending", AmplifiedSession.get("selected"), "no");
    return false;
  },
});
