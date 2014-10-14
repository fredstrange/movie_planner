Template.header.helpers({
    active: function(path){
        return (Session.get('currentPath').indexOf(path) != -1) ? 'active' : '';
    }
});

Template.header.events({});

