var browserify = require('browserify');
var gulp = require('gulp');
var source = require("vinyl-source-stream");
var reactify = require('reactify');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");

gulp.task('browserify', function() {
    var b = browserify({
        entries: ['site/src/js/app.js'],
        debug: true
    });
    b.transform(reactify); // use the reactify transform
    return b.bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest('./site/dist'));
});

gulp.task('compact', function() {
    return gulp.src('site/dist/main.js')
        .pipe(uglify())
        .pipe(rename({
          suffix: '.min'
        }))    
        .pipe(gulp.dest('site/dist'));
});

gulp.task('connect', function () {
    var connect = require('connect');
    var app = connect()
        .use(require('connect-livereload')({ port: 35730 }))
        .use(connect.static('site'))
        .use(connect.static('.tmp'))
        .use(connect.directory('site'));

    require('http').createServer(app)
        .listen(1358)
        .on('listening', function () {
            console.log('Started connect web server on http://127.0.0.1:1358');
        });
});

gulp.task('watch', ['browserify','connect'], function() {
    var live = require('gulp-livereload');
    live.listen();
    // gulp.watch([
    //     'site/src/js/*.js',
    //     'site/dist/main.js'    
    // ]).on('change', function (file) {
    //     live.changed(file.path);
    // });

    gulp.watch('site/dist/main.js',['compact']);
    gulp.watch('site/src/js/*/*.jsx', ['browserify']);
    gulp.watch('site/src/js/*/*.js', ['browserify']);
    gulp.watch('site/src/js/*.jsx', ['browserify']);
    gulp.watch('site/src/js/*.js', ['browserify']);

});

gulp.task('default', ['browserify']);