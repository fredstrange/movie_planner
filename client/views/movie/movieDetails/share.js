Template.share.events({
  'click .fbShare': function () {

    window.open(
      'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(location.href),
      'facebook-share-dialog', 
      'width=626,height=436'); 
    return false;
  },

  'click .twitterShare': function () {

    window.open(
      'https://twitter.com/intent/tweet?text=' + encodeURIComponent(this) + '&url='+encodeURIComponent(location.href),
      'Tweet-dialog', 
      'width=626,height=450'); 
    return false;
  },

  'click .gplusShare': function () {

    window.open(
      'https://plus.google.com/share?url=' + encodeURIComponent(location.href),
      'google-plus-share-dialog', 
      'width=626,height=436'); 
    return false;
  }
});

