/* jshint node: true */

var gulp = require('gulp');
var shell = require('gulp-shell');

var rootDirectory = __dirname + '/../../';
var distDirectory = rootDirectory + 'dist/';
var srcDirectory = rootDirectory + 'src/';
var distTestDirectory = distDirectory + 'test/';
var srcTestDirectory = srcDirectory + 'test/';

var paths = {
  jasmine: srcTestDirectory + 'jasmine/lib/jasmine-2.0.1/*',
  spec: srcTestDirectory + 'spec/*.js',
  data: srcTestDirectory + 'spec/data/*.js',
  specRunner: srcTestDirectory + '*.html'
};

gulp.task('tests.jasmine', function () {
  return gulp.src(paths.jasmine)
    .pipe(gulp.dest(distTestDirectory + 'jasmine/'));
});

gulp.task('tests.html', function () {
  return gulp.src(paths.specRunner)
    .pipe(gulp.dest(distTestDirectory));
});

gulp.task('tests.spec', function () {
  return gulp.src(paths.spec)
    .pipe(gulp.dest(distTestDirectory + 'spec/'));
});

gulp.task('tests.data', function () {
  return gulp.src(paths.data)
    .pipe(gulp.dest(distTestDirectory + 'spec/data'));
});

gulp.task('tests.build', ['tests.jasmine', 'tests.html', 'tests.spec', 'tests.data']);

gulp.task('tests.watch', ['tests.build'], function () {
  gulp.watch(paths.specRunner, ['tests.html']);
  gulp.watch(paths.spec, ['tests.spec']);
  gulp.watch(paths.data, ['tests.data']);
  gulp.watch(paths.jasmine, ['tests.jasmine']);
});

gulp.task('tests.unit', ['tests.build'], function () {
  var testCmd = 'phantomjs ' + distTestDirectory + 'jasmine/run-jasmine2.js ' +
    distTestDirectory + 'UnitTestRunner.html';
  //throw new Error('not yet implemented');
  return gulp.src('')
    .pipe(shell(testCmd));
});
