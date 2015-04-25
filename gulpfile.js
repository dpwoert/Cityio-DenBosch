var gulp = require('gulp');

gulp.task('serve', function() {

    var connect = require('connect');
    var app = connect()
        .use(connect.static('./'))
        .use(connect.directory('./'));

    require('http')
        .createServer(app)
        .listen(9000)
        .on('listening', function () {
            console.log('Started connect web server on http://localhost:9000');
        });

});

gulp.task('import', function() {
    require('./build.js')();
});

gulp.task('update', function() {
    require('./build/create-script.js')();
});
