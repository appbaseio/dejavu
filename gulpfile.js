var browserify = require('browserify');
var gulp = require('gulp');
var source = require("vinyl-source-stream");
var reactify = require('reactify');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var connect = require('gulp-connect');

gulp.task('browserify', function() {
    var b = browserify({
        entries: ['_site/src/js/app.js'],
        debug: true
    });
    b.transform(reactify); // use the reactify transform
    return b.bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest('./_site/dist'))
});

gulp.task('compact', ['browserify'], function() {
    return gulp.src('_site/dist/main.js')
        .pipe(uglify())
        .pipe(rename({
          suffix: '.min'
        }))    
        .pipe(gulp.dest('_site/dist'))
        .pipe(connect.reload());
});

gulp.task('connect', function() {
  connect.server({
    root: '_site',
    livereload: true,
    port: 1358
  });
});

gulp.task('watch', ['compact','connect'], function() {
    gulp.watch([
        '_site/dist/main.min.js'    
    ]).on('change', function (file) {
    });
    gulp.watch('_site/src/js/*/*.jsx', ['compact']);
    gulp.watch('_site/src/js/*.jsx', ['compact']);

});

gulp.task('default', ['compact']);