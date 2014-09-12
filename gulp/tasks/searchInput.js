/* jshint node: true, browser: false */

// gulpfile to build the MindMeldSearchInput source files

'use strict';

// gulp plugins
var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');

// Paths
var rootDirectory = __dirname + '/../../';
var relativeDistDirectory = 'dist/widgets/searchInput/';
var relativeSrcDirectory = 'src/widgets/searchInput/';
var distDirectory = rootDirectory + relativeDistDirectory;
var srcDirectory = rootDirectory + relativeSrcDirectory;

var paths = {
    js: [
        srcDirectory + 'searchInput.js'
    ],
    styles: [
        srcDirectory + 'mindmeldSearchInput.scss'
    ]
};

// Compile and minify SCSS
gulp.task('searchInput.css', function () {
    return gulp.src(paths.styles)
        .pipe(sass())
        .pipe(rename('mindmeldSearchInput.css'))
        .pipe(gulp.dest(distDirectory))
        .pipe(minifyCSS())
        .pipe(rename('mindmeldSearchInput.min.css'))
        .pipe(gulp.dest(distDirectory));
});

// Concat and minify JS
gulp.task('searchInput.js', function () {
    return gulp.src(paths.js)
        .pipe(sourcemaps.init())
            .pipe(concat('mindmeldSearchInput.js'))
            .pipe(gulp.dest(distDirectory))
            .pipe(uglify(), {
                mangle: true
            })
            .pipe(rename('mindmeldSearchInput.min.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(distDirectory));
});


// Main gulp task used to completely build the
// MindMeldSearchInput files
gulp.task('searchInput.build', ['searchInput.js', 'searchInput.css']);

// Watch for changes in source files and automatically build
gulp.task('searchInput.watch', ['searchInput.build'], function () {
    gulp.watch([paths.js], ['searchInput.js']);
    gulp.watch([paths.styles], ['searchInput.css']);
});
