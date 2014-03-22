// Check to see if the movies have been loaded into the database.
// If not seed the database with movie data.

var checkAndLoadMovies = function(){
    var movieLength = Movies.find({}).count();

    if (movieLength === 0 || movieLength === undefined) {
        console.log('Movies is empty, loading movies...');
        loadMovies(saveMovies);
    }
};

// Replace with lookup to SFF's API.
var loadMovies = function(cb){
    var movies =  JSON.parse(Assets.getText("movies.json"));
    cb(movies);
};

var saveMovies = function(movies){
    _.each(movies.initMovies, function (movie) {
        Movies.insert(movie);
    });
};

// Check to see if the cinemas have been loaded into the database.
// If not seed the database with cinema data.

var checkAndLoadCinemas = function(){
    var cinemaLength = Cinemas.find({}).count();

    if (cinemaLength === 0 || cinemaLength === undefined) {
        console.log('Cinemas is empty');
        loadCinemas(saveCinemas);
    }
};

// Replace with lookup to SFF's API.
var loadCinemas = function(cb){
        var cinemas = JSON.parse(Assets.getText("cinemas.json"));
        cb(cinemas);
};

var saveCinemas = function(cinemas){
    _.each(cinemas.initCinemas, function (cinemas) {
        Cinemas.insert(cinemas);
    });
};


Meteor.startup(function () {
    console.log('On server startup');
    checkAndLoadMovies();
    checkAndLoadCinemas();
});
