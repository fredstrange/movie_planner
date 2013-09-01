if (Meteor.isClient) {



Template.movieRow.attending = function(){
  return attendingMovie(this);
};

Template.movieRow.friendsAttending = function(){
  return friendsAttendingMovie(this);
};

Template.movieRow.startTime = function(){
	var d = new Date(this.time);
  return d.getHours() + ':' + d.getMinutes();//moment.unix(this.time).format("ddd, hh:mm");
};

Template.movieRow.goingRowColor = function(){
  var myAttendance = _.find(this.attendings, function (a) {
    return a.user === Meteor.userId();
  }) || {};

  return (myAttendance.attending) ? myAttendance.attending + 'Going' : '';
};
Template.movieRow.isClashing = function(){
	//var movieClashes = this.clashing;
	return (Movies.find({
		'attendings.user': Meteor.userId(),
		'attendings.attending': 'yes',
		_id: {$in: this.clashing }
	}).count() !== 0) ? 'isClashing' : '';


  var myAttendance = _.find(this.attendings, function (a) {
    return a.user === Meteor.userId();
  }) || {};

  return (myAttendance.attending) ? myAttendance.attending + 'Going' : '';
};

Template.movieRow.events({
  'click .movieRow' : function (event) {

    $('.movieRowDetails').hide(300);
    var id = event.currentTarget.id;
    if(AmplifiedSession.equals('selected', id) && Session.equals('rowExpanded', true)){
    	Session.set('rowExpanded', false); 
    	return;
    } 

    AmplifiedSession.set("selected", id);
    Session.set("rowExpanded", true);

    $('#movieRowDetails-' + id).show(300);
    $this.find('.description').height(60);
	$this.find('.more').show();
  	$this.find('.less').hide();
    
    return false;
  }
});

Template.movieRow.rendered = function(){
	console.log('row: '+ this.data._id +' rendered');
//	console.log(this.data.name);
	var id = this.data._id;

/* 

  if(id == AmplifiedSession.get('selected')){
  	$this = $('#movieRowDetails-' + id);
  	console.log($this);
	$this.show();

  }

  
 
  $this.find('.description').height(60);
  $this.find('.more').show();
  $this.find('.less').hide();

	$('.movieRowDetails .description').height(60);
  	$('.movieRowDetails .more').show();
 	$('.movieRowDetails .less').hide();*/
}




}