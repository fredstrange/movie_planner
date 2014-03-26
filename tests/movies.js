var assert = require('assert');

suite('Movies', function() {
    test('in the server', function(done, server) {
        server.eval(function() {
            Movies.insert({name: 'hello title'});
            var docs = Movies.find({name:'hello title'}).fetch();
            emit('docs', docs);
        });

        server.once('docs', function(docs) {
            assert.equal(docs.length, 1);
            done();
        });
    });
});


