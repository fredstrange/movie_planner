Template.nativeProfile.events({
  'click .saveProfileBtn' : function(){
      var username = $('#username').val();
      var email = $('#email').val();

      Meteor.users.update(this._id, {$set:{'profile.name': username}});
  }
});


Template.nativeProfile.helpers({
    email: function(){

        console.log(this)
        try{
            return this.emails[0].address
        }catch (e){
            return '';
        }
    }
});