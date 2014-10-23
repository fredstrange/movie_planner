Package.describe({
  summary: 'jquery mobile'
});

Package.on_use(function (api) {
  api.use('jquery');
  api.add_files(['jquery.mobile.custom.js'], 'client')

});