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

        cinema = (movie) ? Cinemas.findOne({_id: movie.cinema.id}) : void 0;
        return cinema;
    },

    startTime: function (a, b) {
        var d = new Date(this.time * 1000);
        var h = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
        var m = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
        return h + ':' + m;
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
    }
});


Template.movieDetailsMap.helpers({
    externalMapLink: function () {
        var id, movie, cinema;

        id = AmplifiedSession.get('selected');
        movie = Movies.findOne({_id: id});
        cinema = (movie) ? Cinemas.findOne({_id: movie.cinema.id}) : void 0;

        return (cinema)? "http://maps.google.com/?ll=" + cinema.coordinates.lat + ',' + cinema.coordinates.lng + '&q=' + cinema.coordinates.lat + ',' + cinema.coordinates.lng : "";
    }
});


function renderMap() {
    var mapOptions, canvas, id, movie, cinema, lat, lng, marker;

    canvas = $("#map-canvas")[0];
    id = AmplifiedSession.get('selected');
    movie = Movies.findOne({_id: id});

    cinema = (movie) ? Cinemas.findOne({_id: movie.cinema.id}) : void 0;
    if (!canvas || !cinema) return;

    lat = cinema.coordinates.lat;
    lng = cinema.coordinates.lng;

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
    'click .movie-back-btn': function (event, tmpl) {
        history.pushState({}, "Movie Page", '/movies');
        AmplifiedSession.set('selected', '');
    }
});

function initAttending() {

    Deps.autorun(function() {
        var movie, myAttendance = "";

        movie = Movies.findOne(AmplifiedSession.get("selected"));

        if (movie && movie.attendings) {
            myAttendance = _.find(movie.attendings, function (a) {
                return a.user === Meteor.userId();
            }) || {};
        }

        setAttending(myAttendance.attending);

        $(".movie-details-dropdown .dropdown-menu li a").click(function (e) {
            var going = $(this).data('select');
            console.log('ping');
            setAttending(going, true);
        });

        function setAttending(going, save) {
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

            console.log($(".movie-details-dropdown .btn:first-child").html());
            if (save) Meteor.call("attending", AmplifiedSession.get("selected"), going);
        }
    });
}


Template.movieDetails.rendered = function () {
    initAttending();
};



