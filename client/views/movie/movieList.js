Template.movieList.helpers({
    movies: function () {
        return this.movies;
    }
});

Template.movieList.rendered = function(){
   // console.log(this);
}