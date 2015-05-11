'use strict';

var gulp   = require('gulp');
var babel  = require('gulp-babel');
var jscs   = require('gulp-jscs');
var jshint = require('gulp-jshint');
var jst    = require('gulp-amd-jst');
var less   = require('gulp-less');
var path   = require('path');
var rename = require('gulp-rename');

var defaults = {
  dest: 'build',
  reporter: jshint.reporter('default')
};

gulp.task('default', ['lint', 'less', 'jst', 'copy', 'translate']);

gulp.task('less', function() {
  var dest    = path.join(defaults.dest, 'css');
  var options = {
    paths: ['less', 'node_modules/normalize.css']
  };

  return gulp.src('less/main.less')
    .pipe(less(options))
    .pipe(rename('popup.css'))
    .pipe(gulp.dest(dest));
});

gulp.task('lint', function() {
  var files = ['Gulpfile.js', 'js/**/!(configuration).js'];

  return gulp.src(files)
    .pipe(jshint())
    .pipe(defaults.reporter)
    .pipe(jscs());
});

gulp.task('watch', function() {
  gulp.watch('less/*.less', ['less']);
  gulp.watch('templates/*.html', ['jst']);
  gulp.watch('js/**/*.js', ['lint', 'translate']);
});

function _copy(files, dest, useBaseDir) {
  var options;

  if(useBaseDir) options = { base: '.' };

  return gulp.src(files, options)
    .pipe(gulp.dest(dest));
}

gulp.task('copy:vendor', function() {
  var dest  = path.join(defaults.dest, 'js', 'lib');
  var files = [ 'node_modules/backbone/backbone.js'
              , 'node_modules/jquery/dist/jquery.js'
              , 'node_modules/requirejs/require.js'
              ];

  gulp.src('node_modules/lodash/index.js')
    .pipe(rename('lodash.js'))
    .pipe(gulp.dest(dest));

  return _copy(files, dest);
});

gulp.task('copy:main', function() {
  var files = [ 'popup.html'
              , 'manifest.json'
              , 'LICENSE'
              , 'js/contentscript.js'
              , 'js/configuration.js'
              , 'images/*'
              ];

  return _copy(files, defaults.dest, true);
});

gulp.task('copy', ['copy:vendor', 'copy:main']);

gulp.task('jst', function() {
  var dest    = path.join(defaults.dest, 'js', 'templates');
  var options = {
    amd: true,
    namespace: false
  };

  return gulp.src(['templates/*.html'])
    .pipe(jst(options))
    .pipe(gulp.dest(dest));
});

gulp.task('translate', function() {
  var dest  = path.join(defaults.dest, 'js');
  var files = [ 'js/**/!(contentscript|configuration).js'
              , 'js/.secret-api.js'
              ];

  return gulp.src(files)
    .pipe(babel({ modules: 'amd' }))
    .pipe(gulp.dest(dest));
});
