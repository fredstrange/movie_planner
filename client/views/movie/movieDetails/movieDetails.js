Template.movieDetails.movie = function () {
    return Movies.findOne(AmplifiedSession.get("selected"));
};

Template.movieDetails.comments = function () {
    return Comments.find({movieid: AmplifiedSession.get("selected")});
};

Template.movieDetails.maybeChosen = function (what) {
    var myAttendance = _.find(this.attendings, function (a) {
        return a.user === Meteor.userId();
    }) || {};

    return what == myAttendance.attending ? "chosen btn-inverse" : "";
};

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

    otherViewings: function(){
        var self = this;
        var movies = [];
        var moviesCursor =  Movies.find({'movie.id': this.movie.id});
        moviesCursor.forEach(function (movie) {
            var m = {
                time: moment(movie.startTime).format('MMM D HH:mm'),
                id: movie._id
            };
            if(m.id != self._id) movies.push(m);

        });

        return movies;
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
        var date = (AmplifiedSession.get('selectedDate'))? '/' + AmplifiedSession.get('selectedDate') : '';
        history.pushState({}, "Movie Page", '/movies' + date);
        AmplifiedSession.set('selected', '');
    },

    'click .movie-details-dropdown .dropdown-menu li a': function(event){
        var going = $(event.currentTarget).data('select');
        setAttending(going, true);
    }
});

Template.movieDetails.rendered = function () {

    console.log('details rendered');

    initAttending();
    initScrollToTop();
};

var initAttending = function() {

    Tracker.autorun(function() {

        var movie, myAttendance = "";

        movie = Movies.findOne(AmplifiedSession.get("selected"));

        if (movie && movie.attendings) {
            myAttendance = _.find(movie.attendings, function (a) {
                return a.user === Meteor.userId();
            }) || {};
        }

        setAttending(myAttendance.attending);
    });


};

var setAttending = function (going, save) {
    var goingClass, goingText;

    switch (going) {
        case 'no':
            goingClass = 'btn-danger';
            goingText = "Not Going";
            break;
        case 'yes':
            goingClass = 'btn-success';
            goingText = "I'm Going";
            break;
        case 'maybe':
            goingClass = 'btn-warning';
            goingText = "Maybe";
            break;
        default:
            goingClass = 'btn-default';
            goingText = "Undecided";
            break;
    }

    $(".movie-details-dropdown .btn:first-child").html(goingText + ' <span class="caret"></span>');
    $(".movie-details-dropdown .btn:first-child").removeClass('btn-danger btn-success btn-warning btn-default');
    $(".movie-details-dropdown .btn:first-child").addClass(goingClass);

    if (save) Meteor.call("attending", AmplifiedSession.get("selected"), going);
};

var initScrollToTop = function(){
    Deps.autorun(function(){
        var selected = AmplifiedSession.get('selected');
        $('#movie-details-column').scrollTop(0);
    });
};



