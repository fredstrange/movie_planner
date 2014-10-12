
var syncCinemas = function(){
    // Fetch the list of venues from SSF
    var venues = Venues.find().fetch();

    _.each(venues, function(venue){
        var venueLastChanged = venue.hasOwnProperty('modifiedAt')? venue.modifiedAt : venue.createdAt;

        var cinema = Cinemas.findOne({id: venue.id});

        if(!cinema){
            cinema = {};

        }else if( venueLastChanged && cinema.hasOwnProperty('lastSync') && moment(venueLastChanged).isAfter(cinema.lastSync)){
            console.log('continue: ', cinema.id);
            return; // The cinema is up to date, do nothing.
        }



        cinema = _.assign(venue, cinema);

        cinema.distance = {};
        cinema.latlon = cinema.lat + ',' + cinema.lon;
        var position = Positions.findOne({id: cinema.latlon});
        if(!position) return;

        _.each(position.distances, function(distance){
            if(!distance) return;
            cinema.distance[distance.id] = distance;
        });

        cinema.modifiedAt = moment().toJSON();
        cinema.lastSync = moment().toJSON();
        if(cinema._id) delete cinema._id;

        console.dir(cinema);

        Cinemas.update({id:cinema.id}, cinema, {upsert:true});
    });
};


var syncMovies = function(){
    var events = Events.find().fetch();

    _.each(events, function(event){
        var eventLastChanged = event.hasOwnProperty('modifiedAt')? event.modifiedAt : event.createdAt;

        var movie = Movies.findOne({id: event.id});

        if(!movie){
            movie = {};

        }else if( eventLastChanged && movie.hasOwnProperty('lastSync') && moment(eventLastChanged).isAfter(movie.lastSync)){
            console.log('continue: ', movie.id);
            return; // The movie is up to date, do nothing.
        }

        movie = _.assign(event, movie);

        movie.movie = Films.findOne({id:event.filmId});
        movie.cinema = Cinemas.findOne({id: event.venueId})
        movie.lastSync = moment().toJSON();
        movie.startTime = moment(movie.timestamp * 1000).toJSON();
        if(movie._id) delete movie._id;

        Movies.update({id: movie.id}, {$set: movie}, {upsert:true});
    });
};

var determineClashingMovies = function(){
    var movies, clashing, movieArray;
    console.log('recalibrateMovies');

    movieArray = Movies.find().fetch();
    movies = Movies.find();
    clashing = {};

    movies.forEach(function(movie){
        var movieStartTime = moment(movie.startTime),
            movieEndTime = movieStartTime.add(movie.movie.length, 'minutes');

        clashing[movie._id] = [];

        _.each(movieArray, function(m){
            var cinemaWalkDuration, mStartTime, mEndTime, startsDuringMovie, endsDuringMovie;

            if(m._id == movie._id) return;

            // Get time to walk between the cinemas the movies are playing at.
            //cinemaWalkDuration = Cinemas.findOne({_id: movie.cinema.id}).distance[m.cinema.id].duration;

            if(!movie.cinema || !m.cinema || !m.cinema.latlon || !movie.cinema.distance || !movie.cinema.distance[m.cinema.latlon] || !movie.cinema.distance[m.cinema.latlon].duration){
   //             console.dir(movie);
   //             console.dir(m);
                return;
            }
            cinemaWalkDuration = movie.cinema.distance[m.cinema.latlon].duration;

            // Start and end time of the movie
            mStartTime = moment(m.startTime);
            mEndTime = mStartTime.add(m.movie.length, 'minutes');

            startsDuringMovie = (mStartTime.isAfter(movieStartTime) && mStartTime.isBefore(movieEndTime.add(cinemaWalkDuration, 'seconds')));
            endsDuringMovie = (movieStartTime.isAfter(mStartTime) && movieStartTime.isBefore(mEndTime.add(cinemaWalkDuration, 'seconds')));

            if(startsDuringMovie || endsDuringMovie){
                clashing[movie._id].push(m._id);
            }
        });
        Movies.update(movie, {$set: {clashing: clashing[movie._id] }} );
    });

    console.log('complete');
};




Meteor.methods({
    syncCinemas: syncCinemas,
    syncMovies: syncMovies,
    determineClashingMovies:determineClashingMovies
});