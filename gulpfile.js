var browserify = require('browserify');
var gulp = require('gulp');
var source = require("vinyl-source-stream");
var reactify = require('reactify');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");

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

gulp.task('compact', ['browserify'], function() {
    return gulp.src('_site/dist/main.js')
        .pipe(uglify())
        .pipe(rename({
          suffix: '.min'
        }))    
        .pipe(gulp.dest('_site/dist'));
});

gulp.task('connect', function () {
    var connect = require('connect');
    var app = connect()
        .use(require('connect-livereload')({ port: 35730 }))
        .use(connect.static('_site'))
        .use(connect.static('.tmp'))
        .use(connect.directory('_site'));

    require('http').createServer(app)
        .listen(1358)
        .on('listening', function () {
            console.log('Started connect web server on http://127.0.0.1:1358');
        });
});

gulp.task('watch', ['compact','connect'], function() {
    var live = require('gulp-livereload');
    live.listen({port: 35735});
    gulp.watch([
        '_site/dist/main.min.js'    
    ]).on('change', function (file) {
        live.changed(file.path);
    });
    gulp.watch('_site/src/js/*/*.jsx', ['compact']);
    gulp.watch('_site/src/js/*.jsx', ['compact']);

});

gulp.task('default', ['compact']);