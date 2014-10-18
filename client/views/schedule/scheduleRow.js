Template.scheduleRow.helpers({
    time: function(){
       return  moment(this.startTime).format('HH:mm');
    },

    attending: function () {
        return attendingMovie(this);
    },

    friendsAttending: function () {
        return friendsAttendingMovie(this);
    },

    numComments: function () {
        return Comments.find({movieid: this._id}).count();
    }
});