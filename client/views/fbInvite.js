Template.fbInvite.rendered = function(){



    Meteor.call('getFriendsData', function(err, res) {
    	if(err){
	    	console.log('err');
	    	console.log(err);
    	}
    	if(res){
	    	console.log(res);
	//    	Session.set('facebookFriends', data.data);
			var optionData = _.map(res.data, function(item){
				item.text = item.name;
				return item;
			});
	    	console.log(optionData);
	   		$("#fb-friends").select2({
		        placeholder: "Select a friend to invite",
		        allowClear: true,
		        width: 200,
		        data: { results: res.data, text: 'name' }
		    });
    	}
    });
};

Template.fbInvite.helpers({
	facebookFriends: function(){
	//	return Session.get('facebookFriends');
	}
});

Template.fbInvite.events({
	'click .fb-invite-submit' : function(event, tmpl){
		var friendId = $("#fb-friends").val();
	
		console.log('friendId');
		console.log(friendId);		

		Meteor.call('getFacebookAppId', function(err, res){
			var rootURL = (location.host == 'localhost:3000')? 'www.filmfestplanner.com' : location.host;
			var url = 'https://www.facebook.com/dialog/send?' +
				'&app_id=' + res + 
				'&to=' + friendId +
				'&link=' + 'http://' + rootURL + '/invite/' + Meteor.userId() +
	//			'&link=' +  'http://www.filmfestplanner.com/invite' + '/' + Meteor.userId() +
				'&redirect_uri=' + location.href;
			console.log(url);

			window.open(url, 'facebook-invite-dialog', 'width=626,height=436');	
		});
		
	}
});