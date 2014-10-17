Accounts.createUser = _.wrap(Accounts.createUser, function (createUser) {

    // Store the original arguments
    var args = _.toArray(arguments).slice(1),
        user = args[0],
        origCallback = args[1];

    var newCallback = function (error) {

        var user = Meteor.user();
        if (user) {
            if (!user.profile || !user.profile.name) {
                var name = user.emails[0].address;
                if (name) {
                    Meteor.users.update(user._id, {$set: {'profile.name': name.split('@')[0] }});
                }
            }
        }
        origCallback.call(this, error);
    };

    createUser(user, newCallback);
});


/*
 Meteor.loginWithPassword = _.wrap(Meteor.loginWithPassword, function(login) {

 // Store the original arguments
 var args = _.toArray(arguments).slice(1),
 user = args[0],
 pass = args[1],
 origCallback = args[2];

 // Create a new callback function
 // Could also be defined elsewhere outside of this wrapped function
 var newCallback = function() {
 console.info('logged in'); }

 // Now call the original login function with
 // the original user, pass plus the new callback
 login(user, pass, newCallback);

 });
 */