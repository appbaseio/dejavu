var browserify = require('browserify');
var gulp = require('gulp');
var source = require("vinyl-source-stream");
var reactify = require('reactify');

gulp.task('browserify', function() {
	var b = browserify({
		entries: ['_site/src/js/app.js'],
		debug: true
	});
	b.transform(reactify); // use the reactify transform
	return b.bundle()
		.pipe(source('main.js'))
		.pipe(gulp.dest('./_site/dist'));
});

gulp.task('connect', function () {
    var connect = require('connect');
    var app = connect()
        .use(require('connect-livereload')({ port: 35729 }))
        .use(connect.static('_site'))
        .use(connect.static('.tmp'))
        .use(connect.directory('_site'));

    require('http').createServer(app)
        .listen(1358)
        .on('listening', function () {
            console.log('Started connect web server on http://127.0.0.1:1358');
        });
});

gulp.task('watch', ['connect'], function() {
	var live = require('gulp-livereload');
    live.listen();

    gulp.watch([
    	'_site/src/js/*.js',
    	'_site/src/js/*.jsx'	
    ]).on('change', function (file) {
        live.changed(file.path);
    });

	gulp.watch('_site/src/js/*.js', ['browserify']);
	gulp.watch('_site/src/js/*.jsx', ['browserify']);
});

gulp.task('default', ['browserify']);