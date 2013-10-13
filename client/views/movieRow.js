
var isClashing = function(that){
    if(that.clashing){
        return (Movies.find({
                'attendings.user': Meteor.userId(),
                'attendings.attending': 'yes',
                _id: {$in: that.clashing }
            }).count() !== 0);
    }else{
        return false; 
    }
}

Template.movieRow.helpers({
  
    attending: function(){
        return attendingMovie(this);
    },

    friendsAttending: function(){
        return friendsAttendingMovie(this);
    },

    numComments: function(){
        return Comments.find({movieid: this._id}).count();
    },

    startTime: function(a, b){
        var d = new Date(this.time * 1000);
        var h = (d.getHours() < 10)?  "0" + d.getHours() : d.getHours();
        var m = (d.getMinutes() < 10)?  "0" + d.getMinutes() : d.getMinutes();
        return h + ':' + m;
    },

    goingRowColor: function(){
        var myAttendance = _.find(this.attendings, function (a) {
            return a.user === Meteor.userId();
        }) || {};

        return (myAttendance.attending) ? myAttendance.attending + '-going' : '';
    },

    isClashing: function(){
        return isClashing(this) ? 'is-clashing' : '';
    },

    isSelected: function(){
        return AmplifiedSession.equals('selected', this._id) ? "is-selected" : 'not-selected';
    },

    isClashingIcon: function(){
        return isClashing(this)? 'glyphicon-ban-circle' : '';
    },

    isGoingIcon: function(){
        var myAttendance = _.find(this.attendings, function (a) {
            return a.user === Meteor.userId();
        }) || {};
        if(myAttendance.attending == 'yes') return 'glyphicon-ok-circle';
        if(myAttendance.attending == 'maybe') return 'glyphicon-question-sign';
        if(myAttendance.attending == 'no') return 'glyphicon-remove-sign';
        else return false;
    } 



});


if(categorizr.isMobile, categorizr.isTablet){
    Template.movieRow.events({
        'tap  .movieRow' : function (event, tmpl) {

            var id = event.currentTarget.id;
            history.pushState({},"Movie Page", '/movies/' + id);
            AmplifiedSession.set("selected", id);
            
            return false;
        }
    });
}else{
    Template.movieRow.events({
    'click  .movieRow' : function (event, tmpl) {

        var id = event.currentTarget.id;
        history.pushState({},"Movie Page", '/movies/' + id);
        
        if(Meteor.sff.isCompressed()){
            AmplifiedSession.set("selected", id);
        }else{

            $('.movieRowDetails').hide(300);
            if(AmplifiedSession.equals('selected', id) && AmplifiedSession.equals('rowExpanded', true)){
                AmplifiedSession.set('rowExpanded', false); 
        //        AmplifiedSession.set("selected", '');
                return;
            } 


           $('#movieRowDetails-' + id).show(300, function(){
                AmplifiedSession.set("selected", id);
                AmplifiedSession.set("rowExpanded", true);
            }); 
        }

        
        /*
        $this.find('.description').height(60);
        $this.find('.more').show();
        $this.find('.less').hide();

        console.log('movie row clicked. ')
        console.log($this)
*/
        return false;
    }
});
}

Template.movieRow.events({
    'click  .movieRow' : function (event, tmpl) {

        var id = event.currentTarget.id;
        history.pushState({},"Movie Page", '/movies/' + id);
        
        if(Meteor.sff.isCompressed()){
            AmplifiedSession.set("selected", id);
        }else{

            $('.movieRowDetails').hide(300);
            if(AmplifiedSession.equals('selected', id) && AmplifiedSession.equals('rowExpanded', true)){
                AmplifiedSession.set('rowExpanded', false); 
        //        AmplifiedSession.set("selected", '');
                return;
            } 


           $('#movieRowDetails-' + id).show(300, function(){
                AmplifiedSession.set("selected", id);
                AmplifiedSession.set("rowExpanded", true);
            }); 
        }

        
        /*
        $this.find('.description').height(60);
        $this.find('.more').show();
        $this.find('.less').hide();

        console.log('movie row clicked. ')
        console.log($this)
*/
        return false;
    }
});

Template.movieRow.rendered = function(){
//	console.log('row: '+ this.data._id +' rendered');
//	console.log(this.data.name);
	var id = this.data._id;

    this.test = "hello world";

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
};

