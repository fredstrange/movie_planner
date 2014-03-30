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
    console.log('user: ' + Meteor.user());
    var friends;

    try{
        Meteor.user().friends;
    }catch(e){}


    if (friends) {
        if (friends instanceof Array) {
            friendsArr = friends;
        } else {
            friendsArr.push(friends);
        }
    }
    return Meteor.users.find({_id: {$in: friendsArr } });
};

displayName = function (user) {
    if (user.profile && user.profile.name) {
        return user.profile.name;
    } else {
        return user.emails[0].address;
    }
};