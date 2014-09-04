'use strict';

var _         = require('lodash');
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
    paths: ['less', 'bower_components/normalize-css']
  };

  return gulp.src('less/main.less')
    .pipe(less(options))
    .pipe(rename('popup.css'))
    .pipe(gulp.dest('css'));
});

function _lint(files, options) {
  return gulp.src(files)
    .pipe(jshint(options))
    .pipe(defaults.reporter);
}

gulp.task('jshint:gulp', function() {
  var files   = 'Gulpfile.js';
  var options = defaults.jshint;

  return _lint(files, options);
});

gulp.task('jshint:source', function() {
  var files   = 'js/**.js';
  var options = _.merge({
    browser: true,
    globals: { chrome: true }
  }, defaults.jshint);

  return _lint(files, options);
});

gulp.task('jshint', ['jshint:gulp', 'jshint:source']);

gulp.task('watch', function() {
  gulp.watch('less/*.less', ['less']);
  gulp.watch('templates/*.html', ['jst']);
  gulp.watch('js/**/*.js', ['jshint:source', 'requirejs']);
});

function _copy(files, dest, useBaseDir) {
  var options;

  if(useBaseDir) options = { base: '.' };

  return gulp.src(files, options)
    .pipe(gulp.dest(dest));
}

gulp.task('copy:bower', function() {
  var dest  = path.join(defaults.dest, 'js', 'lib');
  var files = 'bower_components/requirejs/require.js';

  return _copy(files, dest);
});

gulp.task('copy:main', function() {
  var files = [ 'popup.html'
              , 'manifest.json'
              , 'LICENSE'
              , 'js/contentscript.js'
              , 'css/*'
              , 'images/*'
              ];

  return _copy(files, defaults.dest, true);
});

gulp.task('copy', ['copy:bower', 'copy:main']);

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
      backbone: '../bower_components/backbone/backbone',
      jquery: '../bower_components/jquery/dist/jquery',
      underscore: '../bower_components/lodash/dist/lodash.underscore',
      template: '../templates'
    },
    onBuildRead: function(moduleName, path, content) {
      var apiKey;
      var newContent = content;

      if(moduleName === 'models/note') {
        apiKey     = require('./.secret/config.json');
        newContent = _.template(content, apiKey);
      }

      return newContent;
    }
  };

  requirejs.optimize(options, function() { callback(); }, callback);
});
