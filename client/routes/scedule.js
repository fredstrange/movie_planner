Router.route('/schedule', {
    onBeforeAction: function(){
        this.next();
    },


    data: function(){
        var date = Router.utils.getDate(this.params);
        var userId = (_.isEmpty(this.params.query.user))? Meteor.userId() : this.params.query.user;
        var movies = Movies.find({date: date, 'attendings.user': userId, 'attendings.attending': 'yes'}, {sort: {'timestamp': 1}}).fetch();

        return {
            movies: movies,
            date: date,
            festival: Festivals.findOne(),
            userId: userId
        };
    },

    action: function() {
        this.render('schedule');
    }
});