Router.route('/movies/', {
    onBeforeAction: function(){
        this.next();
    },

    data: function(){
        var date = Router.utils.getDate(this.params);
        var selected = Router.utils.getMovie(this.params);

        return {
            movies: Movies.find({date: date}, {sort: {'timestamp': 1}}),
            date: date,
            festival: Festivals.findOne(),
            selected: Movies.findOne({_id: selected})
        };
    },

    action: function () {
        this.render('movies');
    }
});
