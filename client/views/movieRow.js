var isClashing = function (that) {
    var clashingMovie, m;

    if (that.clashing) {
        clashingMovie = false;
        m = Movies.find({
            'attendings.user': Meteor.userId(),
            'attendings.attending': 'yes',
            _id: {$in: that.clashing }
        });

        m.forEach(function (movie) {
            _.each(movie.attendings, function (attending, index) {
                if (attending.attending == 'yes' && attending.user == Meteor.userId()) {
                    clashingMovie = true;
                }
            });
        });

        return clashingMovie;
    } else {
        return false;
    }
}

Template.movieRow.helpers({

    attending: function () {
        return attendingMovie(this);
    },

    friendsAttending: function () {
        return friendsAttendingMovie(this);
    },

    numComments: function () {
        return Comments.find({movieid: this._id}).count();
    },

    startTime: function (a, b) {
        var d = new Date(this.time * 1000);
        var h = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
        var m = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
        return h + ':' + m;
    },

    goingRowColor: function () {
        var myAttendance = _.find(this.attendings, function (a) {
            return a.user === Meteor.userId();
        }) || {};

        return (myAttendance.attending) ? myAttendance.attending + '-going' : '';
    },

    isClashing: function () {
        return isClashing(this) ? 'is-clashing' : '';
    },

    isSelected: function () {
        return AmplifiedSession.equals('selected', this._id) ? "is-selected" : 'not-selected';
    },

    isClashingIcon: function () {
        return isClashing(this) ? 'glyphicon-ban-circle' : '';
    },

    isGoingIcon: function () {
        var myAttendance = _.find(this.attendings, function (a) {
            return a.user === Meteor.userId();
        }) || {};
        if (myAttendance.attending == 'yes') return 'glyphicon-ok-circle';
        if (myAttendance.attending == 'maybe') return 'glyphicon-question-sign';
        if (myAttendance.attending == 'no') return 'glyphicon-remove-sign';
        else return false;
    }
});


Template.movieRow.events({
    'click  .movieRow, tap .movieRow': function (event, tmpl) {

        var id = event.currentTarget.id;
        history.pushState({}, "Movie Page", '/movies/' + id);
        AmplifiedSession.set("selected", id);

        if (Session.equals('isCompressed', true)) {
            Session.set('movieListScroll', $(window).scrollTop());
            $(window).scrollTop(0);
        }

        return false;
    }
});


/*
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

 AmplifiedSession.set("selected", id);

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


 $this.find('.description').height(60);
 $this.find('.more').show();
 $this.find('.less').hide();

 console.log('movie row clicked. ')
 console.log($this)

 return false;
 }
 });
 }
 */

Template.movieRow.rendered = function () {
    var position = Session.get('movieListScroll');
    if (position) {
        $(window).scrollTop(position);
        Session.set('movieListScroll', "");
    }
};

