Template.movies.helpers({
	'isMovie': function(){
		return AmplifiedSession.get('selected');
	},

	movies: function(){
		return this.movies;
	},

	dates: function(){
		if(!this.festival) return;

		var dates = [],
			time = moment(this.festival.start),
			end = moment(this.festival.end),
			diff = end.diff(time, 'days');

		for(var i=0; i<diff; i++){
			dates.push({
				date: time.format('YYYY-MM-DD'),
				dateText: time.format('MMM D'),
				timestamp: time.valueOf()
			});

			time.add(1, 'days');

		}
	//	console.log(dates);

		AmplifiedSession.set('maxDate', lodash.max(dates, 'timestamp').timestamp);
		AmplifiedSession.set('minDate', lodash.min(dates, 'timestamp').timestamp);

		return dates;
	},

	model: {model:'movies'}
});

Template.movies.rendered = function(){
	//console.log(this);
	$('#simple-menu, .menuTrigger').sidr({
		name: 'sidr'
	});

};