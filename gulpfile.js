/* jshint node: true, browser: false */

var gulp = require('gulp');
var taskListing = require('gulp-task-listing');
var connect = require('gulp-connect');
var shell = require('gulp-shell');


// -------------------------- Mindmeld.js Tasks -------------------------- //
require('./gulp/tasks/sdk');

gulp.task('buildSDK', ['sdk']);
gulp.task('archiveSDK', ['archive']);
gulp.task('uglifyMM', ['sdk.uglify']);

// ----------------------------------------------------------------------- //


// ------------------------ Search Widget Tasks ------------------------ //
require('./gulp/tasks/searchWidget');

gulp.task('buildSearchWidget', [ 'sw.build']);

// --------------------------------------------------------------------- //


// -------------------------- Voice Navigator -------------------------- //
require('./gulp/tasks/voiceNavigator');

gulp.task('buildVoiceNavigator', ['vn.build']);

// --------------------------------------------------------------------- //

// -------------------------- Microphone Widget -------------------------- //
require('./gulp/tasks/gulpMicrophone');

gulp.task('buildMicrophone', ['mic.build']);

// --------------------------------------------------------------------- //

// -------------------------- Microphone Component -------------------------- //
require('./gulp/tasks/gulpMicrophoneComponent');

gulp.task('buildMicrophoneComponent', ['micComponent.build']);

gulp.task('mic', ['mic.build', 'micComponent.build']);

// --------------------------------------------------------------------- //

// ------------------------------ Tests -------------------------------- //
require('./gulp/tasks/tests');

// --------------------------------------------------------------------- //


// General Tasks
gulp.task('archive', ['sdk.archive', 'docs', 'sw.build', 'vn.build', 'mic']);
gulp.task('build', ['sdk.build', 'sw.build', 'vn.build', 'mic', 'tests.build']);

gulp.task('docs', function () {
  // We do it this slightly hacky way, because you need to jsdoc all the files at once,
  // otherwise index.html keeps getting overwritten.
  var docPaths = [
      'src/sdk/main.js',
      'src/sdk/components/eventDispatcher.js',
      'README.md',
      'src/widgets/voiceNavigator/js/widget.js'
  ];
  var jsdocCmd = './node_modules/.bin/jsdoc --destination dist/docs/' +
    ' --template src/docsTemplate/jaguarjs-doc/' +
    ' --configure src/docsTemplate/jaguar.conf.json' +
    ' ' + docPaths.join(' ');

  gulp.src('')
    .pipe(shell(jsdocCmd));
  gulp.src('README.md')
    .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['build', 'docs']);

gulp.task('serve.no-build', function() {
    connect.server({
        root: __dirname,
        https: true,
        livereload: false
    });
});

// serve the repo to view examples
gulp.task('serve', function() {
    connect.server({
        https: true,
        livereload: false
    });
});

gulp.task('serve.livereload', function() {
    connect.server({
        https: true,
        livereload: true
    });
});

// Task to show list of tasks
gulp.task('tasks', taskListing.withFilters(/\./));
