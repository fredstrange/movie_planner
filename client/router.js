//****************************
//**** Router ****************
//****************************
  Router.configure({
    layout: 'layout',
    loadingTemplate: 'loading',
    renderTemplates: {
        'footer': {to: 'footer'},
        'header': {to: 'header'}
      }
  })


  Router.map(function() { 
    this.route('home', {
      path: '/', 
      template: 'home',
      renderTemplates: {
        'footer': {to: 'footer'},
        'header': {to: 'header'}
      },
      onBeforeRun: function(){
        AmplifiedSession.set('selected', '');
      }

    });

    this.route('profile');
    this.route('profile', {
      path: '/profile/:_id',
      data: function(){
        return Meteor.users.findOne({_id: this.params._id});
      },
      onBeforeRun: function(){
        Session.set('profileId', this.params._id);
      }
    });
    this.route('adminView');
    this.route('schedule');
    this.route('schedule', {
      path: '/schedule/:_id',
      data: function(){
        return {id: this.params._id};
      }
    });

    this.route('invite', {
      path: '/invite/:_id', 
      template: 'invite',
      onBeforeRun: function(){
        Session.set('inviteId', this.params._id);
      }
    });

    this.route('messages', {
      path: '/messages', 
      template: 'messageList', 
      data: function(){
        var messages = Messages.find({'to.id': Meteor.userId()}, {sort:{_id: -1}}); 
        var unRead = [];

        messages.forEach(function (message) {
          if(message.hasRead == false) unRead.push(message._id);
        });

        return {
          messages: messages,
          unRead: unRead
        };
      }
    });     

    this.route('message', {
      path: '/message/:_id', 
      template: 'message',
      data: function(){
        Messages.find({_id: this.params._id});
      }
    });    

    this.route('movies', {
      path: '/movies', 
      template: 'movies',
      onBeforeRun: function(){
        AmplifiedSession.set('selected', '');
      }

    });

    // Has to be last because it uses an id on the root address. 
    this.route('movies', {
      path: '/movies/:_id', 
      template: 'movies',
      onBeforeRun: function(){
        AmplifiedSession.set('selected', this.params._id);
      }
    });

  });