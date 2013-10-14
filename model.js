Movies = new Meteor.Collection("movies");
Comments = new Meteor.Collection("comments");
Cinemas = new Meteor.Collection("cinemas");
CinemaDistances = new Meteor.Collection('cinemaDistances');
Messages = new Meteor.Collection('messages');





Movies.allow({
  insert: function (userId, movie) {
    return false; 
  },  
  remove: function (userId, movie) {
    return false; 
  },
  update: function(userId, movie){
  	return true;
  }
});

Cinemas.allow({
  insert: function (userId, movie) {
    return true; 
  },  	
  remove: function (userId, movie) {
    return false; 
  },
  update: function(userId, movie){
  	return true;
  }
});

Comments.allow({
  insert: function (userId, comment) {
    return true; 
  },  
  remove: function (userId, comment) {
    return false; 
  },
  update: function(userId, comment){
  	return true;
  }
});

Messages.allow({
  insert: function (userId, comment) {
    return true; // no cowboy inserts -- use createParty method
  },  
  remove: function (userId, comment) {
    return false; // no cowboy inserts -- use createParty method
  },
  update: function(userId, comment){
  	return true;
  }
});






attendingMovie = function (movie) {
  return (_.groupBy(movie.attendings, 'attending').yes || []).length;
};

friendsAttendingMovie = function (movie) {
	if(!Meteor.user()) return 0;
  	var friends = Meteor.user().friends;
  	
  	return (_.filter(movie.attendings, function(a){
  		return (a.attending == 'yes' && _.contains(friends, a.user));
	}) || []).length;
};

getFriends = function(){
	var friendsArr = [];
	var friends = Meteor.user().friends;


	if(friends){
		if(friends instanceof Array){
			friendsArr = friends;
		}else{
			friendsArr.push(friends);
		}
	}	
	return Meteor.users.find({_id: {$in: friendsArr } });
}

displayName = function (user) {
  if (user.profile && user.profile.name){
    return user.profile.name;
  }else{
  	return user.emails[0].address;
  }
};


var configureCinemaDistances = function(callback){

	var cinemaArray, i, origin, service, 
		cinemaMap = {},
		currentIndex = 0,
		currentCinema,
		origins = "";

	cinemaArray = Cinemas.find().fetch();
	var cinemaArray2 = Cinemas.find().fetch();

	console.log(cinemaArray2);
	

	for(i = 0; i < cinemaArray.length; i++){
		if(i > 0) origins += '|';
		origins += cinemaArray[i].coordinates.lat + ',' +  cinemaArray[i].coordinates.lng;
	}

	getDistance();


	function getDistance(){
		var google = Npm.require('googlemaps');

		currentCinema = cinemaArray[currentIndex];
		origin = currentCinema.coordinates.lat + ',' +  currentCinema.coordinates.lng;
		google.distance(origin, origins, onDistance, false, "walking");		
	}

	function onDistance(err, data) {
		var row, element, i, rowCinema,
		util = Npm.require('util');

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
			//updateCinemaDistances(cinemaMap);
			setTimeout(getDistance, 5000);
			//getDistance();
		}else{
			updateCinemaDistances(cinemaMap);
		}

	}; 

	function updateCinemaDistances(cinemaMap){
		console.log('updateCinemaDistances');

		Fiber(function(){
			_.each(cinemaMap, function(value, key){

				(function(key, value){
					console.log('value');
					console.log(value);
					console.log('key');
					console.log(key);

					Cinemas.update({_id: key}, {$set: {distance: value}});
				})(key, value);
			});

			recalibrateMovies();

		}).run();

	}


}

var recalibrateMovies = function(){
	console.log('recalibrateMovies');
	var movies, clashing, movieStartTime, movieEndTime;

	movieArray = Movies.find().fetch();
	movies = Movies.find();
	clashing = {};

	movies.forEach(function(movie){
		//console.log(movie._id);
		movieStartTime = movie.time;
		movieEndTime = movie.time + movie.duration;
		
		clashing[movie._id] = [];
		
		_.each(movieArray, function(m){
				if(m._id == movie._id) return;
			var	cinemaWalkDuration = Cinemas.findOne({_id: movie.cinema.id}).distance[m.cinema.id].duration;
				mStartTime = m.time,
				mEndTime = m.time + m.duration,

				//console.log(cinemaWalkDuration + " " + mStartTime + " " + mEndTime);

				startsDuringMovie = (mStartTime >= movieStartTime && mStartTime <= (movieEndTime + cinemaWalkDuration)),
				endsDuringMovie = (movieStartTime >= mStartTime && movieStartTime <= (mEndTime + cinemaWalkDuration));

			if(startsDuringMovie || endsDuringMovie){
				clashing[movie._id].push(m._id);
			}
		});
		Movies.update(movie, {$set: {clashing: clashing[movie._id] }} );

	});
//	    	AmplifiedSession.set('clashing', clashing);
};


var fixCinemaids = function(){
	movies = Movies.find();

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






Meteor.methods({


	attending: function(movieId, state){
		check(movieId, String);
	    check(state, String);

	    if (! this.userId)
	      throw new Meteor.Error(403, "You must be logged in to Attend");
	    if (! _.contains(['yes', 'no', 'maybe', 'undecided'], state))
	      throw new Meteor.Error(400, "Invalid Attendance");
	    var movie = Movies.findOne(movieId);
	    if (! movie)
	      throw new Meteor.Error(404, "No such movie");

	    var movieIndex = _.indexOf(_.pluck(movie.attendings, 'user'), this.userId);
	    if (movieIndex !== -1) {
	      // update existing attendance entry

	      if (Meteor.isServer) {
	        // update the appropriate attendance entry with $
	        Movies.update(
	          {_id: movieId, "attendings.user": this.userId},
	          {$set: {"attendings.$.attending": state}});
	      } else {
	        // minimongo doesn't yet support $ in modifier. as a temporary
	        // workaround, make a modifier that uses an index. this is
	        // safe on the client since there's only one thread.
	        var modifier = {$set: {}};
	        modifier.$set["attendings." + movieIndex + ".attending"] = state;
	        Movies.update(movieId, modifier);
	      }

	      // Possible improvement: send email to the other people that are
	      // coming to the party.
	    } else {
	      // add new rsvp entry
	      if(!Movies.findOne({_id: movieId}).attendings) Movies.update(movieId, {$set: {attendings: []}} );

	      Movies.update(movieId,
	                     {$push: {attendings: {user: this.userId, attending: state}}});
	    }

	},

//	fixCinemaids: fixCinemaids,
	recalibrateMovies: recalibrateMovies,
	configureCinemaDistances: configureCinemaDistances

});



if (Meteor.isServer) {

	Fiber = Npm.require('fibers');



	Meteor.startup(function () {
		console.log('On server startup');

//		var google = Meteor.require('googlemaps'),
//			util = Meteor.require('util');

		var movieLength = Movies.find({}).count();

	    if(movieLength === 0 || movieLength === undefined){

	      console.log('Movies is empty');
	      var movies = {};
	      movies = JSON.parse(Assets.getText("movies.json"));
	      _.each(movies.initMovies, function(movie){
	        Movies.insert(movie);
	      });
	    }

		var cinemaLength = Cinemas.find({}).count();
	    if(cinemaLength === 0 || cinemaLength === undefined){

	      console.log('Cinemas is empty');
	      var cinemas = {};
	      cinemas = JSON.parse(Assets.getText("cinemas.json"));
	      _.each(cinemas.initCinemas, function(cinemas){
	        Cinemas.insert(cinemas);
	      });
	    }



	//	fixCinemaids();
	 //   configureCinemaDistances();
	 //  recalibrateMovies();

	});



}




Accounts.createUser = _.wrap(Accounts.createUser, function(createUser) {

    // Store the original arguments
    var args = _.toArray(arguments).slice(1),
        user = args[0];
        origCallback = args[1];

    var newCallback = function(error) {

    	var user = Meteor.user()
	  	if(user){
	  		if(!user.profile || !user.profile.name){
	  			var name = user.emails[0].address;
	  			if(name){
	  				Meteor.users.update(user._id, {$set: {'profile.name': name.split('@')[0] }} );
	  			}
	  		}
	  	} 
       

        origCallback.call(this, error);
    };

    createUser(user, newCallback);
});



/*
Meteor.loginWithPassword = _.wrap(Meteor.loginWithPassword, function(login) {

  // Store the original arguments
  var args = _.toArray(arguments).slice(1),
      user = args[0],
      pass = args[1],
      origCallback = args[2];

  // Create a new callback function
  // Could also be defined elsewhere outside of this wrapped function
  var newCallback = function() { 
  	console.info('logged in'); }

  // Now call the original login function with
  // the original user, pass plus the new callback
  login(user, pass, newCallback);

});
*/

