var browserify = require('browserify');
var gulp = require('gulp');
var source = require("vinyl-source-stream");
var reactify = require('reactify');

gulp.task('browserify', function() {
	var b = browserify({
		entries: ['src/js/app.js'],
		debug: true
	});
	b.transform(reactify); // use the reactify transform
	return b.bundle()
		.pipe(source('main.js'))
		.pipe(gulp.dest('./dist'));
});

gulp.task('watch', ['browserify'], function() {
	gulp.watch('src/js/*/*.jsx', ['browserify']);
	gulp.watch('src/js/*/*.js', ['browserify']);
	gulp.watch('src/js/*.jsx', ['browserify']);
	gulp.watch('src/js/*.js', ['browserify']);
});

gulp.task('default', ['browserify']);