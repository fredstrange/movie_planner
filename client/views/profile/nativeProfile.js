Template.nativeProfile.events({
  'click .saveProfileBtn' : function(){
      var username = $('#username').val();
      var email = $('#email').val();

      Meteor.users.update(this._id, {$set:{'profile.name': username}});
  }
});