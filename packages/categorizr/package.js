Package.describe({
  summary: 'Device detection script to categorize devices as desktop, tv, tablet, or mobile.'
});

Package.on_use(function (api) {
  api.add_files(['categorizr.js'], 'client')

});