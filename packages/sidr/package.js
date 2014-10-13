Package.describe({
summary: "Karbon Core library"
});

Package.on_use(function (api) {
api.versionsFrom('METEOR@0.9.0');

api.use(['jquery'], ['client']);;

api.add_files(["jquery.sidr.js", "stylesheets/jquery.sidr.dark.css"], "client");


api.export('karboncore', 'server');
api.export('KarbonAccount',  ['client','server']);
});