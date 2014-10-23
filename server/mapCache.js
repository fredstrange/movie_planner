var fs = Npm.require('fs');
var exec = Npm.require('child_process').exec;
var http = Npm.require('http');
var folderPath = process.env.MAP_PATH;


Meteor.startup(function () {
    try{
        ensureExists(folderPath, 'meteoruser', function(e){
            if(e) console.log(e);
        });
    }catch(e){
        console.log('Failed to create the folder.', e);
    }

});


Router.route('/files/maps/:path', function () {
    var self = this;
    var response = this.response;
    var path = this.params.path;
    var completePath = folderPath + path;

 //   console.log('will serve static content @ '+ path);


    try{
        fs.exists(completePath, function (exists) {

            var lat, lon, parts;
            var regx = /([\-0-9]*\.[0-9][^\.\,\|]*)/g;

            if(exists) {
                renderFile(path, response);
            }
            else {
                parts = path.match(regx);

                if(parts.length == 2){
                    fetchfile(parts[0], parts[1], response);
                }else{
                    response.end("empty");
                }
            }
        });
    }catch (e){
        console.log('failed at some point when trying to fetch the map. ', e);
    }



}, {where: 'server'});





var renderFile = function(path, res){
    var file = fs.readFileSync(folderPath + path);

    var headers = {
        'Content-type': 'image/png',
        'Content-Disposition': "attachment; filename=" + path
    };

    res.writeHead(200, headers);
    return res.end(file);

};

var fetchfile = function(lat, lon, res){
//    console.log("fetch file");

    var outerRes = res;
    var url = 'http://maps.googleapis.com/maps/api/staticmap?';
    url += 'markers=color:red%7Clabel:%7C' + lat + ',' + lon;
    url += '&size=' + '400x400';
    url += '&zoom=15';
    url += '&sensor=false';

    var filename = lat + '|' + lon + '.png';
    var file = fs.createWriteStream(folderPath + filename);

    console.log(url);

    http.get(url, function(res) {
        res.on('data', function(data) {
            file.write(data);

        }).on('end', function() {
            file.end();
            console.log(filename + ' downloaded to ' + folderPath);
            renderFile(filename, outerRes);

        }).on('error', function(e) {
            console.log("Got error: " + e.message);
            return res.end("empty");

        });
    });

    //return res.end("empty");
};


function ensureExists(path, user, mask,  cb) {
    if (typeof mask == 'function') { // allow the `mask` parameter to be optional
        cb = mask;
        mask = 0777;
    }

    fs.mkdir(path, mask, function(err) {
        if (err) {
            if (err.code == 'EEXIST') {
                cb(null);
            } // ignore the error if the folder already exists
            else{
                cb(err); // something else went wrong
            }
        } else {

            getuid(user, function(err3, userid){

              if(err3){
                  cb(err3);
              }else{
                  fs.chown(path, parseInt(userid), function(err2){
                      if (err) cb(err2);
                      else cb(null);
                  });
              }
            });
        }
    });// successfully created folder
}

function getuid(username, cb) {
    exec('id -u ' + username, function (err, stdout, stderr) {
        cb(err, stdout);
    });
}