Template.schedule.helpers({
	myMovies: function(){
		var i, startCinema, endCinema, cinema, movies, 
		
			userId = (this && this.id)? this.id : Meteor.userId(),
			movies = Movies.find({'attendings.user': userId, 'attendings.attending': 'yes' }).fetch();

		for(i = 0; i < movies.length-1; i++){
			startCinema = Cinemas.findOne({_id: movies[i].cinema.id});
			endCinema = Cinemas.findOne({_id: movies[i+1].cinema.id}); 

			movies[i].map = {
				origin: startCinema,
				destination: endCinema,
				distance: startCinema.distance[endCinema._id].distance,
				duration: Math.floor( startCinema.distance[endCinema._id].duration / 60 )
			}
		}

			console.log(movies);
		return movies;
	}
});

Template.scheduleRow.helpers({
	map: function(){
		console.log(this);
	}
});

Template.scheduleRow.rendered = function(){
	$(window).scrollTop(0);
}