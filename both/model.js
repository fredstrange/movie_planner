Movies = new Meteor.Collection("movies");
Comments = new Meteor.Collection("comments");
Cinemas = new Meteor.Collection("cinemas");
CinemaDistances = new Meteor.Collection('cinemaDistances');


Movies.allow({
    insert: function (userId, movie) {
        return false;
    },
    remove: function (userId, movie) {
        return false;
    },
    update: function (userId, movie) {
        return true;
    }
});

Cinemas.allow({
    insert: function (userId, movie) {
        return false;
    },
    remove: function (userId, movie) {
        return false;
    },
    update: function (userId, movie) {
        return true;
    }
});

Comments.allow({
    insert: function (userId, comment) {
        return true;
    },
    remove: function (userId, comment) {
        return false;
    },
    update: function (userId, comment) {
        return true;
    }
});

