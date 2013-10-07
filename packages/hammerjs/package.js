Package.describe({
  summary: 'Add touch events to the meteor ui'
});

Package.on_use(function (api) {
  api.use('jquery');
  api.add_files(['jquery.hammer.js'], 'client')

});