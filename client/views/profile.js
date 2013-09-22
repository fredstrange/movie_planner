var sendInvitation = function(email, message){
  var from = {
    email: email
  }

  Meteor.call('registerInvite', Meteor.user(), from, message, function(err, rtn){
    console.log(err); 
    console.log(rtn); 
  })
}


Template.profile.userImage = function(){
	return Session.get('userImage');
};

Template.profile.rendered = function(){
	Meteor.call('userImage', function(err, uri){
		Session.set('userImage', uri); 
	});

  Meteor.call('userService', function(err, result){
    Session.set('userService', result);
  });
}

Template.profile.friendsName = function(){
  var user = Meteor.users.findOne(this.toString());
  return displayName(user);
};

Template.profile.isTwitter = function(){
  return Meteor.sff.userService() == 'twitter';
};

Template.profile.isFacebook = function(){
  return Meteor.sff.userService() == 'facebook';
};

Template.profile.isGoogle = function(){
  return Meteor.sff.userService() == 'google';
};

Template.profile.isNative = function(){
  return Meteor.sff.userService() == 'native';
};

Template.profile.helpers({

})




Template.profile.events({
  'click .saveProfileBtn' : function(){
      var username = $('#username').val();
      var email = $('#email').val();

      Meteor.users.update(this._id, {$set:{'profile.name': username}});
  },
  'click #inviteSubmit': function(){
    var email = $('#inviteEmail').val(),
        message = $('#inviteMessage').val()

    if(email){
      if(Meteor.utils.validateEmail(email)){
          console.log(email);
          sendInvitation(email, message);
      }else{
          console.log("invalid email");
      }
    }else{
      console.log('no email');
    }
  }
});




