'use strict';

var gulp      = require('gulp');
var jshint    = require('gulp-jshint');
var jst       = require('gulp-jst');
var less      = require('gulp-less');
var path      = require('path');
var rename    = require('gulp-rename');
var requirejs = require('requirejs');
var vmap      = require('vinyl-map');

var defaults = {
  dest: 'build',
  jshint: require('./.jshintrc'),
  reporter: jshint.reporter('default')
};

gulp.task('default', ['jshint', 'less', 'jst', 'copy', 'requirejs']);

gulp.task('less', function() {
  var options = {
    paths: ['less', 'node_modules/normalize.css']
  };

  return gulp.src('less/main.less')
    .pipe(less(options))
    .pipe(rename('popup.css'))
    .pipe(gulp.dest('css'));
});

gulp.task('jshint', function() {
  var files   = ['Gulpfile.js', 'js/**/!(configuration).js'];
  var options = defaults.jshint;

  return gulp.src(files)
    .pipe(jshint(options))
    .pipe(defaults.reporter);
});

gulp.task('watch', function() {
  gulp.watch('less/*.less', ['less']);
  gulp.watch('templates/*.html', ['jst']);
  gulp.watch('js/**/*.js', ['jshint', 'requirejs']);
});

function _copy(files, dest, useBaseDir) {
  var options;

  if(useBaseDir) options = { base: '.' };

  return gulp.src(files, options)
    .pipe(gulp.dest(dest));
}

gulp.task('copy:vendor', function() {
  var dest  = path.join(defaults.dest, 'js', 'lib');
  var files = 'node_modules/requirejs/require.js';

  return _copy(files, dest);
});

gulp.task('copy:main', function() {
  var files = [ 'popup.html'
              , 'manifest.json'
              , 'LICENSE'
              , 'js/contentscript.js'
              , 'js/configuration.js'
              , 'css/*'
              , 'images/*'
              ];

  return _copy(files, defaults.dest, true);
});

gulp.task('copy', ['copy:vendor', 'copy:main']);

function addAmdWrapper(content) {
  var template = [ 'define(function(){'
                 , 'return ' + content.toString()
                 , '});'
                 ];

  content = template.join('\n\n');

  return new Buffer(content);
}

gulp.task('jst', function() {
  return gulp.src(['templates/*.html'])
    .pipe(jst())
    .pipe(vmap(addAmdWrapper))
    .pipe(gulp.dest('templates'));
});

gulp.task('requirejs', function(callback) {
  var dest = path.join(defaults.dest, 'js', 'popup.js');
  var options = {
    baseUrl: 'js',
    name: 'popup',
    out: dest,
    cjsTranslate: true,
    optimize: 'none',
    paths: {
      backbone: '../node_modules/backbone/backbone',
      jquery: '../node_modules/jquery/dist/jquery',
      underscore: '../node_modules/lodash/index',
      template: '../templates'
    }
  };

  requirejs.optimize(options, function() { callback(); }, callback);
});
