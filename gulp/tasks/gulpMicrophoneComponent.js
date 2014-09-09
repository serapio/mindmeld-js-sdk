/* jshint node: true, browser: false */

// gulpfile to build the mindmeld-microphone web component, mindmeld-microphone-component.html
// This gulpfile compiles SCSS, minifies JS, and vulcanizes the component so that
// it can be consumed via a single HTML file that has no external CSS or JS

'use strict';

// gulp plugins
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var vulcanize = require('gulp-vulcanize');
var inject = require('gulp-inject');
var es = require('event-stream');

// Paths
var rootDirectory = __dirname + '/../../';
var relativeDistDirectory = 'dist/widgets/microphone/';
var relativeSrcDirectory = 'src/widgets/microphone/';
var distDirectory = rootDirectory + relativeDistDirectory;
var srcDirectory = rootDirectory + relativeSrcDirectory;

var paths = {
    html: srcDirectory + 'component/microphone-template.html',
    js: [
        srcDirectory + 'microphone.js',
        srcDirectory + 'volumeMonitor.js',
        srcDirectory + 'component/microphone-component.js'
    ],
    styles: [
        srcDirectory + 'mindmeldMicrophone.scss'
    ]
};

// Concat and minify JS
gulp.task('micComponent.js', function () {
    return gulp.src(paths.js)
        .pipe(sourcemaps.init())
            .pipe(concat('mindmeld-microphone-component.js'))
            .pipe(gulp.dest(distDirectory + 'component'))
            .pipe(uglify(), {
                mangle: true
            })
            .pipe(rename('mindmeld-microphone-component.min.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(distDirectory + 'component'));
});


// Create mindmeld-microphone.html and inject unminified JS and CSS
gulp.task('micComponent.html', ['mic.css', 'micComponent.js'], function () {
    var injectSources = gulp.src([
        distDirectory + 'component/mindmeld-microphone-component.js',
        distDirectory + 'mindmeldMicrophone.css'
    ], {
        read: false
    });

    return gulp.src(paths.html)
        .pipe(inject(injectSources, {
            addRootSlash: false,
            relative: true
        }))
        .pipe(rename('mindmeld-microphone-component.html'))
        .pipe(gulp.dest(distDirectory + 'component/'));
});

// Create mindmeld-microphone.min.html and inject minified JS and CSS
gulp.task('micComponent.html.min', ['mic.css', 'micComponent.js'], function () {
    var injectSources = gulp.src([
        distDirectory + 'component/mindmeld-microphone-component.min.js',
        distDirectory + 'mindmeldMicrophone.min.css'
    ], {
        read: false
    });

    return gulp.src(paths.html)
        .pipe(inject(injectSources, {
            addRootSlash: false,
            relative: true
        }))
        .pipe(rename('mindmeld-microphone-component.min.html'))
        .pipe(gulp.dest(distDirectory + 'component/'));
});


// Vulcanize inlines references to external scripts & stylesheets
// so that our web component is just a single, baller HTML file
gulp.task('micComponent.vulcanize', ['micComponent.vulcanize.unminified', 'micComponent.vulcanize.min']);


// Vulcanize mindmeld-microphone.html
gulp.task('micComponent.vulcanize.unminified', ['micComponent.html'], function () {
    return gulp.src(distDirectory + 'component/mindmeld-microphone-component.html')
        // Weird, but necessary to specify dest in vulcanize gulp task.
        // vulcanize REPLACES mindmeld-microphone.html with
        // an inlined version
        .pipe(vulcanize({dest: distDirectory + 'component/', inline: true}))
        .pipe(gulp.dest(distDirectory + 'component/'));
});

// Vulcanize mindmeld-microphone.min.html. A weird bug in vulcanize
// prevents two separate vulcanize processes from running at the
// same time so we wait for the unminified version to finish before
// starting the minified version here
gulp.task('micComponent.vulcanize.min', ['micComponent.html.min', 'micComponent.vulcanize.unminified'], function () {
  return gulp.src(distDirectory + 'component/mindmeld-microphone-component.min.html')
    .pipe(vulcanize({dest: distDirectory + 'component/', inline: true}))
    .pipe(gulp.dest(distDirectory + 'component/'));
});


// Main gulp task used to completely build the
// mindmeld microphone web component
gulp.task('micComponent.build', ['micComponent.vulcanize']);

// Watch for changes in source files and automatically build everything
gulp.task('micComponent.watch', ['micComponent.vulcanize'], function () {
   gulp.watch([
       paths.html,
       paths.js,
       paths.styles
   ],
   [
       'micComponent.vulcanize'
   ]);
});
