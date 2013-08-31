Package.describe({
  summary: 'Fix elements on the screen when scrolling'
});

Package.on_use(function (api) {
  api.use('jquery');
  api.add_files(['jquery-scrolltofixed.js'], 'client')

});