// gulpfile to build the MindMeldMicrophone source files

'use strict';

// gulp plugins
var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var es = require('event-stream');

// Paths
var rootDirectory = __dirname + '/../../';
var relativeDistDirectory = 'dist/widgets/microphone/';
var relativeSrcDirectory = 'src/widgets/microphone/';
var distDirectory = rootDirectory + relativeDistDirectory;
var srcDirectory = rootDirectory + relativeSrcDirectory;

var paths = {
    js: [
        srcDirectory + 'microphone.js',
        srcDirectory + 'volumeMonitor.js'
    ],
    styles: [srcDirectory + '*.scss']
};

// Compile and minify SCSS
gulp.task('mic.css', function () {
    return gulp.src(paths.styles)
        .pipe(sass())
        .pipe(rename('mindmeld-microphone.css'))
        .pipe(gulp.dest(distDirectory))
        .pipe(minifyCSS())
        .pipe(rename('mindmeld-microphone.min.css'))
        .pipe(gulp.dest(distDirectory));
});

// Concat and minify JS
gulp.task('mic.js', function () {
    return gulp.src(paths.js)
        .pipe(sourcemaps.init())
            .pipe(concat('mindmeld-microphone.js'))
            .pipe(gulp.dest(distDirectory))
            .pipe(uglify(), {
                mangle: true
            })
            .pipe(rename('mindmeld-microphone.min.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(distDirectory));
});



// Main gulp task used to completely build the
// MindMeldMicrophone files
gulp.task('mic.build', ['mic.js', 'mic.css']);

// Watch for changes in source files and automatically build
gulp.task('mic.watch', ['mic.build'], function () {
    gulp.watch([paths.js], ['mic.js']);
    gulp.watch([paths.styles], ['mic.css']);
});
