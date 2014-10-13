
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
        var isNew = false;
        var movie = Movies.findOne({id: event.id});

        if(!movie){
            movie = {};
            isNew = true;

        }else if( eventLastChanged && movie.hasOwnProperty('lastSync') && moment(eventLastChanged).isAfter(movie.lastSync)){
            console.log('continue: ', movie.id);
            return; // The movie is up to date, do nothing.
        }

        movie = _.assign(event, movie);

        movie.movie = Films.findOne({id:event.filmId});
        movie.cinema = Cinemas.findOne({id: event.venueId})
        movie.lastSync = moment().toJSON();
        movie.startTime = moment(movie.timestamp * 1000).toJSON();
        movie.date = (event.date) ? event.date : moment(movie.timestamp * 1000).format('YYYY-MM-DD');
        if(movie._id) delete movie._id;

        if(isNew){
            Movies.update({id: movie.id}, movie, {upsert:true});
        }else{

            Movies.update({id: movie.id}, movie);
        }
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
            movieEndTime = moment(movieStartTime).add(movie.movie.length, 'minutes');

        clashing[movie._id] = [];

        _.each(movieArray, function(m){
            var cinemaWalkDuration, mStartTime, mEndTime, startsDuringMovie, endsDuringMovie;

            if(m._id == movie._id) return;

            // Get time to walk between the cinemas the movies are playing at.
            //cinemaWalkDuration = Cinemas.findOne({_id: movie.cinema.id}).distance[m.cinema.id].duration;
            try{
                cinemaWalkDuration = movie.cinema.distance[m.cinema.latlon].duration;
            }catch(e){
                console.log('Failed to extract the walking distance.');
                return;
            }

            // Start and end time of the movie
            mStartTime = moment(m.startTime);
            mEndTime = moment(mStartTime).add(m.movie.length, 'minutes');

            startsDuringMovie = (mStartTime.unix() >= movieStartTime.unix() && mStartTime.unix() <= moment(movieEndTime).add(cinemaWalkDuration, 'seconds').unix());
            endsDuringMovie = (movieStartTime.unix() >= mStartTime.unix() && movieStartTime.unix() <= moment(mEndTime).add(cinemaWalkDuration, 'seconds').unix());

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