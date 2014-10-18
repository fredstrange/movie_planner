Template.schedule.helpers({
	myMovies: function(){
		var i, startCinema, endCinema, movies, movies, duration, bufferStartTime, bufferEndTime, hours, minutes, buffer;

			movies = this.movies;

		for(i = 0; i < movies.length-1; i++){

			// Map details
			startCinema = movies[i].cinema;
			endCinema =  movies[i+1].cinema;

			duration = Math.floor( startCinema.distance[endCinema.latlon].duration / 60 );
			bufferStartTime = moment(movies[i].startTime).add(movies[i].movie.length, 'minutes').add(duration, 'minutes');
			bufferEndTime = moment(movies[i+1].startTime);

			hours = bufferEndTime.diff(bufferStartTime, 'hours');
			minutes = bufferEndTime.diff(bufferStartTime, 'minutes') % 60;

			buffer = ((hours)? hours + ' hour' + ((hours != 1)? 's': '') + ' and ': '') + minutes + ' minute' + ((minutes != 1)? 's': '');

            try{
                movies[i].map = {
                    origin: startCinema,
                    destination: endCinema,
                    distance: startCinema.distance[endCinema.latlon].distance,
                    duration: duration,
					buffer: buffer
                }
            }catch(e){
                console.log("No map for movie" + i);
            }
		}
		return movies;
	},

	model: {model: 'schedule'}
});

Template.scheduleRow.helpers({});

Template.scheduleRow.created = function(){
	$(window).scrollTop(0);
}