// gulpfile to build the mindmeld-microphone web component, mindmeld-microphone.html
// This gulpfile compiles SCSS, minifies JS, and vulcanizes the component so that
// it can be consumed via a single HTML file that has no external CSS or JS

'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var vulcanize = require('gulp-vulcanize');

// Paths
var rootDirectory = __dirname + '/../../';
var distDirectory = rootDirectory + 'dist/widgets/microphone/';
var srcDirectory = rootDirectory + 'src/widgets/microphone/';

var paths = {
    html: srcDirectory + 'microphone.html',
    js: [srcDirectory + '*.js'],
    styles: [srcDirectory + '*.scss']
};

// Compile SCSS
gulp.task('mic.css', function () {
    return gulp.src(paths.styles)
        .pipe(sass())
        .pipe(rename('mindmeld-microphone.css'))
        .pipe(gulp.dest(distDirectory))
});

// Concat and minify JS
gulp.task('mic.js', function () {
    return gulp.src(paths.js)
        .pipe(sourcemaps.init())
            .pipe(concat('mindmeld-microphone.js')) // file never written to disk
            .pipe(uglify(), {
                mangle: true
            })
            .pipe(rename('mindmeld-microphone.min.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(distDirectory));
});

// Copy web component HTML to dist
gulp.task('mic.html', function () {
    return gulp.src(paths.html)
        .pipe(rename('mindmeld-microphone.html'))
        .pipe(gulp.dest(distDirectory));
});

// Vulcanize inlines references to external scripts & stylesheets
// so that our web component is just a single, baller HTML file
gulp.task('mic.vulcanize', ['mic.css', 'mic.js', 'mic.html'], function () {
    return gulp.src(distDirectory + 'mindmeld-microphone.html')
        // Weird, but necessary to specify dest in vulcanize gulp task.
        // vulcanize REPLACES mindmeld-microphone.html with
        // an inlined version
        .pipe(vulcanize({dest: distDirectory, inline: true}))
        .pipe(gulp.dest(distDirectory));

});

// Main gulp task used to completely build the
// mindmeld microphone web component
gulp.task('mic.build', [
        'mic.js',
        'mic.css',
        'mic.html',
        'mic.vulcanize'
    ]
);