Template.header.helpers({
    active: function(path){
        return Session.get('currentPath') == path ? 'active' : '';
    }
});

Template.header.events({});

