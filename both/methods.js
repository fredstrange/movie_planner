Meteor.methods({

    attending: function (movieId, state) {
        check(movieId, String);
        check(state, String);

        if (!this.userId)
            throw new Meteor.Error(403, "You must be logged in to Attend");
        if (!_.contains(['yes', 'no', 'maybe', 'undecided'], state))
            throw new Meteor.Error(400, "Invalid Attendance");
        var movie = Movies.findOne(movieId);
        if (!movie)
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
        } else {
            if (!Movies.findOne({_id: movieId}).attendings) Movies.update(movieId, {$set: {attendings: []}});

            Movies.update(movieId,
                {$push: {attendings: {user: this.userId, attending: state}}});
        }

    }
});