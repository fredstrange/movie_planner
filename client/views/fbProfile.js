var getFriends = function(){
	$.ajax({
		url: '',
		dataType: 'json',
		complete: function(xhr, status){
			console.log(xhr);
			console.log(status);
		}
	})
}

var onFriendsRecieved = function(){

}

var addFriend = function(friendId){
	var service = "https://www.facebook.com/dialog/send?"
		appId = "app_id=" + "",
		link = "&link=",
		redirect_uri = "&redirect_uri=" + location.host,
		to = "&to=" + friendId,
		url = service + appId + link + redirect_uri + to;

	window.open(url);

}