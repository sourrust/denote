/* jshint node: true */
'use strict';

var gulp   = require('gulp');
var babel  = require('gulp-babel');
var jscs   = require('gulp-jscs');
var jshint = require('gulp-jshint');
var jst    = require('gulp-amd-jst');
var less   = require('gulp-less');
var rename = require('gulp-rename');

var defaults = {
  dest: 'build',
  reporter: jshint.reporter('default')
};

gulp.task('default', ['lint', 'less', 'jst', 'copy', 'translate']);

gulp.task('less', function() {
  var dest    = 'build/css';
  var options = {
    paths: ['less', 'node_modules/normalize.css']
  };

  return gulp.src('less/main.less')
    .pipe(less(options))
    .pipe(rename('popup.css'))
    .pipe(gulp.dest(dest));
});

gulp.task('lint', function() {
  var files = ['Gulpfile.js', 'js/**/*.js'];

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
  var dest  = 'build/js/lib';
  var files = [ 'node_modules/backbone/backbone.js'
              , 'node_modules/jquery/dist/jquery.js'
              , 'node_modules/requirejs/require.js'
              , 'node_modules/lodash/index.js'
              ];

  return gulp.src(files)
    .pipe(rename(function(path) {
      if(path.basename === 'index') {
        path.basename = 'lodash';
      }
    }))
    .pipe(gulp.dest(dest));
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
  var dest    = 'build/js/templates';
  var options = {
    amd: true,
    namespace: false
  };

  return gulp.src('templates/*.html')
    .pipe(jst(options))
    .pipe(gulp.dest(dest));
});

gulp.task('translate', function() {
  var dest    = 'build/js';
  var options = { ignore: 'js/con(tentscript|figuration).js' };
  var files   = [ 'js/**/*.js'
                , 'js/.secret-api.js'
                ];

  return gulp.src(files, options)
    .pipe(babel({ modules: 'amd' }))
    .pipe(gulp.dest(dest));
});
