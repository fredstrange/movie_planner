attendingMovie = function (movie) {
    return (_.groupBy(movie.attendings, 'attending').yes || []).length;
};

friendsAttendingMovie = function (movie) {
    if (!Meteor.user()) return 0;
    var friends = Meteor.user().friends;

    return (_.filter(movie.attendings, function (a) {
        return (a.attending == 'yes' && _.contains(friends, a.user));
    }) || []).length;
};

getFriends = function () {
    var friendsArr = [];

    var friends = Meteor.users.findOne(Meteor.userId()).friends;


    if (friends) {
        if (friends instanceof Array) {
            friendsArr = friends;
        } else {
            friendsArr.push(friends);
        }
    }
    return Meteor.users.find({_id: {$in: friendsArr } }).fetch();
};

displayName = function (user) {
    if (user.profile && user.profile.name) {
        return user.profile.name;
    } else {
        return user.emails[0].address;
    }
};