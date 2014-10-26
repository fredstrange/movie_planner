Router.route('/invite/:_id', {
    onBeforeAction: function () {
        Session.set('inviteId', this.params._id);
        this.next();
    },

    action: function () {
        this.render('invite');
    }

});
