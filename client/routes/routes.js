Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',

    onBeforeAction: function(){
        Session.set('currentPath', this.location.path);
        this.render('header', {to: 'header'});
        this.render('footer', {to: 'footer'});
        this.next();
    },
    waitOn: function() { return Meteor.subscribe('users')}
});