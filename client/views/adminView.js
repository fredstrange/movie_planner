

Meteor.loginAsAdmin = function(password, callback) {
  //create a login request with admin: true, so our loginHandler can handle this request
  var loginRequest = {admin: true, password: password};

  //send the login request
  Accounts.callLoginMethod({
    methodArguments: [loginRequest],
    userCallback: callback
  });
};


Template.adminView.events({
	'click #configure-cinema-distances': function(){
		Meteor.call('configureCinemaDistances');
	},
	'click #fix-cinemaids': function(){
		Meteor.call('fixCinemaids');
	},
	'click #recalibrate-movies': function(){
		Meteor.call('recalibrateMovies');
	},
})

