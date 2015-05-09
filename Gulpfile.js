'use strict';

var gulp      = require('gulp');
var jshint    = require('gulp-jshint');
var jst       = require('gulp-amd-jst');
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
              , 'css/*'
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

function commonJSWrapper(content) {
  var template = [ 'define(function(require, exports, module) {'
                 , content.toString().trim()
                 , '});'
                 ];

  content = template.join('\n\n');

  return new Buffer(content);
}

gulp.task('translate', function() {
  var dest  = path.join(defaults.dest, 'js');
  var files = [ 'js/**/!(contentscript|configuration).js'
              , 'js/.secret-api.js'
              ];

  return gulp.src(files)
    .pipe(vmap(commonJSWrapper))
    .pipe(gulp.dest(dest));
});
