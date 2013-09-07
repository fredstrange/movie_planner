Movies = new Meteor.Collection("movies");
Cinemas = new Meteor.Collection("cinemas");

Movies.allow({
  insert: function (userId, movie) {
    return false; // no cowboy inserts -- use createParty method
  },  
  remove: function (userId, movie) {
    return false; // no cowboy inserts -- use createParty method
  },
  update: function(userId, movie){
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
	return Meteor.users.find({_in: {$in: friendsArr } });
}

displayName = function (user) {
  if (user.profile && user.profile.name){
    return user.profile.name;
  }else{
  	return user.emails[0].address;
  }
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

	}
});



if (Meteor.isServer) {
	Meteor.startup(function () {

		console.log('On server startup');


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
	    			var mStartTime = m.time,
	    				mEndTime = m.time + m.duration,

	    				startsDuringMovie = (mStartTime >= movieStartTime && mStartTime <= movieEndTime),
	    				endsDuringMovie = (movieStartTime >= mStartTime && movieStartTime <= mEndTime);

	    			if(startsDuringMovie || endsDuringMovie){
	    				clashing[movie._id].push(m._id);
	    			}
	    		});
	    		Movies.update(movie, {$set: {clashing: clashing[movie._id] }} );

	    	});
//	    	AmplifiedSession.set('clashing', clashing);
	    }

	    recalibrateMovies();


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
