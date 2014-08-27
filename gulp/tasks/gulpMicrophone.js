// gulpfile to build the mindmeld-microphone web component, mindmeld-microphone.html
// This gulpfile compiles SCSS, minifies JS, and vulcanizes the component so that
// it can be consumed via a single HTML file that has no external CSS or JS

'use strict';

// gulp plugins
var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var vulcanize = require('gulp-vulcanize');
var inject = require('gulp-inject');
var es = require('event-stream');

// Paths
var rootDirectory = __dirname + '/../../';
var distDirectory = rootDirectory + 'dist/widgets/microphone/';
var srcDirectory = rootDirectory + 'src/widgets/microphone/';

var paths = {
    html: srcDirectory + 'microphone.html',
    js: [srcDirectory + '*.js'],
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


// Create mindmeld-microphone.html and inject unminified JS and CSS
gulp.task('mic.html.unminified', ['mic.css', 'mic.js'], function () {
    var injectSources = gulp.src([
        distDirectory + 'mindmeld-microphone.js',
        distDirectory + 'mindmeld-microphone.css'
    ], {
        read: false
    });

    return gulp.src(paths.html)
        .pipe(inject(injectSources, {
            ignorePath: 'dist/widgets/microphone/',
            addRootSlash: false
        }))
        .pipe(rename('mindmeld-microphone.html'))
        .pipe(gulp.dest(distDirectory));
});

// Create mindmeld-microphone.min.html and inject minified JS and CSS
gulp.task('mic.html.min', ['mic.css', 'mic.js'], function () {
    var injectSources = gulp.src([
            distDirectory + 'mindmeld-microphone.min.js',
            distDirectory + 'mindmeld-microphone.min.css'
    ], {
        read: false
    });

    return gulp.src(paths.html)
        .pipe(inject(injectSources, {
            ignorePath: 'dist/widgets/microphone/',
            addRootSlash: false
        }))
        .pipe(rename('mindmeld-microphone.min.html'))
        .pipe(gulp.dest(distDirectory));
});


// Vulcanize inlines references to external scripts & stylesheets
// so that our web component is just a single, baller HTML file
gulp.task('mic.vulcanize', ['mic.vulcanize.unminified', 'mic.vulcanize.min']);


// Vulcanize mindmeld-microphone.html
gulp.task('mic.vulcanize.unminified', ['mic.html.unminified'], function () {
    return gulp.src(distDirectory + 'mindmeld-microphone.html')
        // Weird, but necessary to specify dest in vulcanize gulp task.
        // vulcanize REPLACES mindmeld-microphone.html with
        // an inlined version
        .pipe(vulcanize({dest: distDirectory, inline: true}))
        .pipe(gulp.dest(distDirectory));
});

// Vulcanize mindmeld-microphone.min.html. A weird bug in vulcanize
// prevents two separate vulcanize processes from running at the
// same time so we wait for the unminified version to finish before
// starting the minified version here
gulp.task('mic.vulcanize.min', ['mic.html.min', 'mic.vulcanize.unminified'], function () {
  return gulp.src(distDirectory + 'mindmeld-microphone.min.html')
    .pipe(vulcanize({dest: distDirectory, inline: true}))
    .pipe(gulp.dest(distDirectory));
});


// Main gulp task used to completely build the
// mindmeld microphone web component
gulp.task('mic.build', ['mic.vulcanize']);

// Watch for changes in source files and automatically build everything
gulp.task('mic.watch', ['mic.vulcanize'], function () {
   gulp.watch([
       paths.html,
       paths.js,
       paths.styles
   ],
   [
       'mic.vulcanize'
   ]);
});
