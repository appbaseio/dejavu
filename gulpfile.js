var browserify = require('browserify');
var gulp = require('gulp');
var source = require("vinyl-source-stream");
var reactify = require('reactify');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var connect = require('gulp-connect');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');

var files = {
    css: {
        vendor: [
            '_site/bower_components/font-awesome/css/font-awesome.min.css',
            '_site/bower_components/toastr/toastr.min.css',
            '_site/vendors/highlight/highlight.min.css',
            '_site/bower_components/select2/dist/css/select2.min.css',
            '_site/vendors/awesome-bootstrap-checkbox/checkbox.css',
            '_site/bower_components/codemirror/addon/dialog/dialog.css',
            '_site/bower_components/codemirror/lib/codemirror.css',
            '_site/bower_components/codemirror/addon/fold/foldgutter.css',
            '_site/bower_components/bootstrap/dist/css/bootstrap.min.css'
        ],
        custom: ['_site/src/css/*.css']
    },
    js: {
        vendor: [
            '_site/bower_components/underscore/underscore-min.js',
            '_site/bower_components/appbase-js/browser/appbase.min.js',
            '_site/bower_components/jquery/dist/jquery.min.js',
            '_site/bower_components/bootstrap/dist/js/bootstrap.min.js',
            '_site/bower_components/toastr/toastr.min.js',
            '_site/bower_components/crypto-js/crypto-js.js',
            '_site/bower_components/codemirror/lib/codemirror.js',
            '_site/bower_components/codemirror/addon/edit/matchbrackets.js',
            '_site/bower_components/codemirror/addon/edit/closebrackets.js',
            '_site/bower_components/codemirror/addon/fold/foldcode.js',
            '_site/bower_components/codemirror/addon/fold/foldgutter.js',
            '_site/bower_components/codemirror/addon/fold/brace-fold.js',
            '_site/bower_components/codemirror/mode/javascript/javascript.js',
            '_site/bower_components/select2/dist/js/select2.full.min.js',
            '_site/bower_components/highlightjs/highlight.pack.min.js',
            '_site/bower_components/lzma/src/lzma.js',
            '_site/bower_components/urlsafe-base64/app.js',
            '_site/bower_components/auth0.js/build/auth0.min.js'
        ],
        custom: [
            
        ]
    },
    folders: {
        assets: '_site/assets/**/*',
        dist: '_site/dist/**/*',
        src: '_site/src/**/*',
        vendors: '_site/vendors/**/*',
        buttons: '_site/buttons/**/*'
    },
    moveFiles: [
        '_site/index.html',
        '_site/config.js',
        'manifest.json',
        'background.js'
    ]
};

gulp.task('browserify', function() {
    var b = browserify({
        entries: ['_site/src/js/app.js'],
        debug: true
    });
    b.transform(reactify); // use the reactify transform
    return b.bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest('./_site/dist'))
         .pipe(connect.reload());
});

gulp.task('vendorcss', function() {
    return gulp.src(files.css.vendor)
        .pipe(concat('vendor.min.css'))
        .pipe(gulp.dest('_site/dist/css'));
});

gulp.task('customcss', function() {
    return gulp.src(files.css.custom)
        .pipe(minifyCSS())
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('_site/dist/css'));
});


gulp.task('cssChanges',['customcss'], function() {
    connect.reload();
});

gulp.task('vendorjs', function() {
    return gulp.src(files.js.vendor)
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest('_site/dist/js'));
});

gulp.task('customjs', function() {
    return gulp.src(files.js.custom)
        .pipe(concat('custom.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(uglify())
        .pipe(concat('custom.min.js'))
        .pipe(gulp.dest('_site/dist/js'));
});

gulp.task('moveCss', function() {
    return gulp.src(['_site/bower_components/bootstrap/dist/css/bootstrap.min.css.map'])
        .pipe(gulp.dest('_site/dist/css'));
});

gulp.task('moveFonts', function() {
    return gulp.src(['_site/bower_components/bootstrap/dist/fonts/*', 
        '_site/bower_components/font-awesome/fonts/*'])
        .pipe(gulp.dest('_site/dist/fonts'));
});

gulp.task('moveJs', function() {
    return gulp.src(['_site/bower_components/lzma/src/lzma_worker.js',
        '_site/vendors/JSONURL.js'])
        .pipe(gulp.dest('_site/dist/vendor'));
});

gulp.task('connect', function() {
  connect.server({
    root: '_site',
    livereload: true,
    port: 8000
  });
});

gulp.task('bundle', [
    'customcss', 
    'vendorcss', 
    'vendorjs', 
    'customjs',  
    'moveCss',
    'moveFonts',
    'moveJs']);

gulp.task('compact',['browserify'], function() {
    return gulp.src('_site/dist/main.js')
        .pipe(uglify())
        .pipe(rename({
          suffix: '.min'
        }))    
        .pipe(gulp.dest('_site/dist'))
        .pipe(connect.reload());
});

gulp.task('watch', ['bundle', 'compact','connect'], function() {
    gulp.watch('_site/src/js/*/*.jsx', ['compact']);
    gulp.watch('_site/src/js/*.jsx', ['compact']);
    gulp.watch(files.css.custom, ['cssChanges']);
});

gulp.task('chromeBuild', ['bundle', 'compact'], function() {
    var folders_length = Object.keys(files.folders).length;
    for(folder in files.folders) {
        gulp.src(files.folders[folder])
            .pipe(gulp.dest('./dejavu-unpacked/'+folder));   
    }
    gulp.src(files.moveFiles)
        .pipe(gulp.dest('./dejavu-unpacked'));
});

gulp.task('ghpagesBuild', ['bundle', 'compact'], function() {
    var folders_length = Object.keys(files.folders).length;
    for(folder in files.folders) {
        gulp.src(files.folders[folder])
            .pipe(gulp.dest('./live/'+folder));   
    }
    gulp.src(files.moveFiles)
        .pipe(gulp.dest('./live'));
});

gulp.task('default', ['bundle', 'compact']);
