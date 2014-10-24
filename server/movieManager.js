// To determine how long it takes to move from cinema A to cinema B, a lookup is performed to Google maps.
// The distance and walking time between each cinema is then saved into a hash.
//
// This method should be triggered after you import the cinemas for the first time.

var configureCinemaDistances = function(callback){

    var cinemaArray, i,
        cinemaMap = {},
        currentIndex = 0,
        currentCinema,
        origins = "",
        google = Meteor.require('googlemaps'),
        util = Npm.require('util');

    cinemaArray = Cinemas.find().fetch();

    for(i = 0; i < cinemaArray.length; i++){
        if(i > 0) origins += '|';
        origins += cinemaArray[i].coordinates.lat + ',' +  cinemaArray[i].coordinates.lng;
    }

    // Start the distance calculation
    currentCinema = cinemaArray[currentIndex];
    getDistance(currentCinema);

    //Trigger the request to Google maps.
    function getDistance(cinema){
        var origin = cinema.coordinates.lat + ',' +  cinema.coordinates.lng;
        google.distance(origin, origins, onDistance, false, "walking");
    }

    // On response from Google maps. Parse the data into
    function onDistance(err, data) {
        var row, element, i, rowCinema;

        //Trace the JSON data to the server console.
        util.puts(JSON.stringify(data));

        if(err){
            console.log(err);
        }else{
            row = data.rows[0];
            if(row && row.elements && row.elements.length != 0)
            {
                cinemaMap[currentCinema._id] = {};
                console.log('Element length: ' + row.elements.length);
                console.log('cinemaArray length: ' + cinemaArray.length);

                for(i = 0; i < row.elements.length; i++){
                    element = row.elements[i];
                    rowCinema = cinemaArray[i];

                    cinemaMap[currentCinema._id][rowCinema._id] = {};
                    cinemaMap[currentCinema._id][rowCinema._id].distance = element.distance.value;
                    cinemaMap[currentCinema._id][rowCinema._id].duration = element.duration.value;
                }
            }
        }

        currentIndex++;

        if(currentIndex < cinemaArray.length){
            setTimeout(function() {
                currentCinema = cinemaArray[currentIndex]
                getDistance(currentCinema);
            }, 5000);
        }else{
            updateCinemaDistances(cinemaMap);
        }

    }

    //Update all the Cinema Objects with the distance information.
    function updateCinemaDistances(cinemaMap){
        console.log('updateCinemaDistances');
        Fiber = Npm.require('fibers');

        Fiber(function(){
            _.each(cinemaMap, function(value, key){
                (function(key, value){
                    Cinemas.update({_id: key}, {$set: {distance: value}});
                })(key, value);
            });

            recalibrateMovies();

        }).run();
    }
};





// When movie events are imported and the cinema distances have been determined, run this method to
// create a list of clashing movies and save them to the movie object.

var recalibrateMovies = function(){
    var movies, clashing, movieArray;
    console.log('recalibrateMovies');

    movieArray = Movies.find().fetch();
    movies = Movies.find();
    clashing = {};

    movies.forEach(function(movie){
        var movieStartTime = movie.time,
            movieEndTime = movie.time + movie.duration;

        clashing[movie._id] = [];

        _.each(movieArray, function(m){
            var cinemaWalkDuration, mStartTime, mEndTime, startsDuringMovie, endsDuringMovie;

            if(m._id == movie._id) return;

            // Get time to walk between the cinemas the movies are playing at.
            cinemaWalkDuration = Cinemas.findOne({_id: movie.cinema.id}).distance[m.cinema.id].duration;

            // Start and end time of the movie
            mStartTime = m.time;
            mEndTime = m.time + m.duration;

            startsDuringMovie = (mStartTime >= movieStartTime && mStartTime <= (movieEndTime + cinemaWalkDuration));
            endsDuringMovie = (movieStartTime >= mStartTime && movieStartTime <= (mEndTime + cinemaWalkDuration));

            if(startsDuringMovie || endsDuringMovie){
                clashing[movie._id].push(m._id);
            }
        });
        Movies.update(movie, {$set: {clashing: clashing[movie._id] }} );
    });
};


var fixCinemaIds = function(){
    var movies = Movies.find();

    movies.forEach(function(movie){
        var cinema = Cinemas.findOne({name: movie.cinema});

        if(cinema){
            Movies.update(movie, {
                $set: {
                    cinema: {
                        name: cinema.name,
                        id:cinema._id
                    }
                }
            });
        }
    });
};
/*

Meteor.methods({
    fixCinemaIds: fixCinemaIds,
    recalibrateMovies: recalibrateMovies,
    configureCinemaDistances: configureCinemaDistances
});*/
