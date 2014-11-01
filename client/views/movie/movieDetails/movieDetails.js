var isClashing = function (that) {
    if (that.clashing) {
        return (Movies.find({
            'attendings.user': Meteor.userId(),
            'attendings.attending': 'yes',
            _id: {$in: that.clashing }
        }).count() !== 0);
    } else {
        return false;
    }
};


Template.movieDetails.helpers({
    mapCinema: function () {
        var id, movie, cinema;

        id = AmplifiedSession.get('selected');
        movie = Movies.findOne({_id: id});

        cinema = (movie) ? movie.cinema : void 0;
        return cinema;
    },

    startTime: function () {
     //   console.log(this.timestamp);
     //   console.log(moment(this.timestamp));
        return moment(this.timestamp * 1000).format('MMM D HH:mm');;
    },

    playTime: function (id) {
        return (this.duration / 60).toFixed(0);
    },

    attending: function () {
        return attendingMovie(this);
    },

    friendsAttending: function () {
        return friendsAttendingMovie(this);
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
    },

    name: function(){
        return this.name_en;
    },

    description: function(){
        return this.movie.description_en;
    },

    duration: function(){
        return this.movie.length;
    },
    type: function(){
        return this.movie.sectionName;
    },

    trailerUrl: function(){
        if(this.movie.youtubeId){
            return "http://www.youtube.com/watch?v=" + this.movie.youtubeId;
        }
    },

    infoURL: function(){
        return this.movie.infoURL;
    },

    previewImage: function(){
        return this.movie.previewImage.replace("[IMAGESIZE]", "100x143");
    },

    otherViewings: function(){
        var self = this;
        var movies = [];
        var moviesCursor =  Movies.find({'movie.id': this.movie.id});
        moviesCursor.forEach(function (movie) {
            var m = {
                time: moment(movie.startTime).format('MMM D HH:mm'),
                id: movie._id,
                ticketStatus: movie.ticketStatus
            };
            if(m.id != self._id) movies.push(m);

        });

        return movies;
    },

    goingText: function(){
        var attending = AmplifiedSession.get('attendingSelected');

        switch (attending) {
            case 'no':
                return "Not Going";
            case 'yes':
                return "I'm Going";
            case 'maybe':
                goingText = "Maybe";
            default:
                return "Undecided";
        }
    },

    goingBtnClass: function(){

        var attending = AmplifiedSession.get('attendingSelected');

        switch (attending) {
            case 'no':
                return 'btn-danger';
            case 'yes':
                return 'btn-success';
            case 'maybe':
                return 'btn-warning';
            default:
                return 'btn-default';
        }
    },

    fbShareMessage: function(){
        return 'I am going to see ' + this.movie.name_en + '! #FilmFestPlanner';
    },
    movie: function () {
        return Movies.findOne(AmplifiedSession.get("selected"));
    },
    comments: function () {
        return Comments.find({movieid: AmplifiedSession.get("selected")});
    },
    maybeChosen: function (what) {
        var myAttendance = _.find(this.attendings, function (a) {
                return a.user === Meteor.userId();
            }) || {};

        return what == myAttendance.attending ? "chosen btn-inverse" : "";
    }

});


Template.movieDetailsMap.helpers({
    externalMapLink: function () {
        var id, movie, cinema;

        id = AmplifiedSession.get('selected');
        movie = Movies.findOne({_id: id});
        cinema = (movie) ? movie.cinema : void 0;

        return (cinema)? "http://maps.google.com/?ll=" + cinema.lat + ',' + cinema.lon + '&q=' + cinema.lat + ',' + cinema.lon : "";
    }
});


function renderMap() {
    var mapOptions, canvas, id, movie, cinema, lat, lng, marker;

    canvas = $("#map-canvas")[0];
    id = AmplifiedSession.get('selected');
    movie = Movies.findOne({_id: id});

    cinema = (movie) ? movie.cinema : void 0;
    if (!canvas || !cinema) return;

    lat = cinema.lat;
    lng = cinema.lon;

    mapOptions = {
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    map = new google.maps.Map(canvas, mapOptions);

    map.setCenter(new google.maps.LatLng(lat, lng));
    marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        title: cinema.name,
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    });
    marker.setMap(map);
}


Template.movieDetails.events({
    'click .movie-back-btn': function (event) {
       // var date = (AmplifiedSession.get('selectedDate'))? '/' + AmplifiedSession.get('selectedDate') : '';
        history.pushState({}, "Movie Page", '/movies');
        AmplifiedSession.set('selected', '');
    },

    'click .movie-details-dropdown .dropdown-menu li a': function(event){
        var going = $(event.currentTarget).data('select');
        AmplifiedSession.set('attendingSelected', going);
        Meteor.call("attending", AmplifiedSession.get("selected"), going);
    }
});

Template.movieDetails.rendered = function () {

 //   console.log('details rendered');
    initScrollToTop();
};

var initScrollToTop = function(){
    Deps.autorun(function(){
        var selected = AmplifiedSession.get('selected');
        $('#movie-details-column').scrollTop(0);
    });
};



