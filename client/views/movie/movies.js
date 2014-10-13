Template.movies.helpers({
	'isMovie': function(){
		return (AmplifiedSession.get('selected'));
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
				dateText: time.format('MMM D')
			});
			time.add(1, 'days');
		}

		return dates;
	}
});

Template.movies.rendered = function(){
	//console.log(this);
	$('#simple-menu').sidr({
		name: 'sidr'
	});
/*	var mc = new Hammer.Manager(document.body, {
		recognizers: [
			[Hammer.Swipe,{ direction: Hammer.DIRECTION_HORIZONTAL }],
			]
	});*/




};