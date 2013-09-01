Template.movieRowDetails.isSelected = function (id) {
  return AmplifiedSession.get("selected") == id ? "" : "hidden";
};

Template.movieRowDetails.playTime = function (id) {
  return (this.duration / 60).toFixed(0);//moment.duration(this.duration, 'seconds').asMinutes().toFixed(0);
};

Template.movieRowDetails.maybeChosen = function (what) {
  var myAttendance = _.find(this.attendings, function (a) {
    return a.user === Meteor.userId();
  }) || {};

  return what == myAttendance.attending ? "chosen btn-inverse" : "";
};

Template.movieRowDetails.events({
  'click .rsvp_yes': function (event) {
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
  'click .more': function(event, template){
    event.stopPropagation();
    event.preventDefault();

    console.log('more clicked');

    showMore(AmplifiedSession.get('selected'));
  },
  'click .less': function(event, template){
    event.stopPropagation();
    event.preventDefault();
    
    console.log('less clicked');
    showLess(AmplifiedSession.get('selected'));
  }
});

Template.movieRowDetails.rendered = function() {
//  console.log('rowDetails are rendered');
  var id = $(this.find('.movieRowDetails')).attr('movie');
  if(AmplifiedSession.equals('selected', id)){
    showDetails(id);
    return;
  } 

  reset(id);
}

var showMore = function(id, time){
  console.log('showMore' + id);
  time = (time !== void 0)? time : 500;
  Session.set('detailsExpanded', id);

  $this = $('#movieRowDetails-' + id);
  $this.find('.more').hide();
  $this.find('.less').show();
  $('#movieRowDetails-' + id + ' .description').animate({height: "300px"}, time);
}

var showLess = function(id, time){
  console.log('showLess' + id);

  time = (time !== void 0)? time : 500;
  Session.set('detailsExpanded', void 0);

  $this = $('#movieRowDetails-' + id);
  $this.find('.more').show();
  $this.find('.less').hide();
  $('#movieRowDetails-' + AmplifiedSession.get('selected') + ' .description').animate({height: "60px"}, time);
}

var reset = function(id){
  console.log('reset' + id);
  $this = $('#movieRowDetails-' + id);
  $this.hide();
  $this.find('.description').height(60);
  $this.find('.more').show();
  $this.find('.less').hide();
}

var showDetails = function(id){
  console.log('showDetails' + id);
  var $this = $('#movieRowDetails-' + id);
  $this.show();

  if(Session.equals('detailsExpanded', id)){
    showMore(id, 0);
  }else{
    showLess(id, 0);
  }
}

var hideDetails = function(){
  
}


