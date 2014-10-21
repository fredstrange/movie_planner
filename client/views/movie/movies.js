Template.movies.helpers({
	'isMovie': function(){
		return AmplifiedSession.get('selected');
	},

	movies: function(){
		return this.movies;
	},

	model: {model:'movies'}
});

Template.movies.rendered = function(){

};