/* jshint node: true */
'use strict';

let gulp       = require('gulp');
let babel      = require('gulp-babel');
let jscs       = require('gulp-jscs');
let jshint     = require('gulp-jshint');
let jst        = require('gulp-amd-jst');
let less       = require('gulp-less');
let rename     = require('gulp-rename');
let sourcemaps = require('gulp-sourcemaps');
let template   = require('gulp-template');

let packageJSON = require('./package');

gulp.task('default',
  ['lint', 'less', 'jst', 'copy', 'manifest', 'translate']
);

gulp.task('less', function() {
  let dest    = 'build/css';
  let options = {
    paths: ['less', 'node_modules/normalize.css']
  };

  return gulp.src('less/main.less')
    .pipe(less(options))
    .pipe(rename('popup.css'))
    .pipe(gulp.dest(dest));
});

gulp.task('lint', function() {
  let files    = ['Gulpfile.js', 'js/**/*.js'];
  let reporter = jshint.reporter('default');

  return gulp.src(files)
    .pipe(jshint())
    .pipe(reporter)
    .pipe(jscs());
});

gulp.task('watch', function() {
  gulp.watch('less/*.less', ['less']);
  gulp.watch('templates/*.html', ['jst']);
  gulp.watch('js/**/*.js', ['lint', 'translate']);
});

gulp.task('copy:vendor', function() {
  let dest  = 'build/js/lib';
  let files = [ 'node_modules/backbone/backbone.js'
              , 'node_modules/jquery/dist/jquery.js'
              , 'node_modules/requirejs/require.js'
              , 'node_modules/lodash/lodash.js'
              ];

  return gulp.src(files)
    .pipe(gulp.dest(dest));
});

gulp.task('copy:main', function() {
  let dest    = 'build';
  let options = { base: '.' };
  let files   = [ 'popup.html'
                , 'LICENSE'
                , 'js/contentscript.js'
                , 'js/configuration.js'
                , 'images/*'
                ];

  return gulp.src(files, options)
    .pipe(gulp.dest(dest));
});

gulp.task('copy', ['copy:vendor', 'copy:main']);

gulp.task('jst', function() {
  let dest    = 'build/js/templates';
  let options = {
    amd: true,
    namespace: false
  };

  return gulp.src('templates/*.html')
    .pipe(jst(options))
    .pipe(gulp.dest(dest));
});

gulp.task('translate', function() {
  let dest    = 'build/js';
  let options = { ignore: 'js/con(tentscript|figuration).js' };
  let files   = [ 'js/**/*.js'
                , 'js/.secret-api.js'
                ];

  return gulp.src(files, options)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015'],
      plugins: ['transform-es2015-modules-amd']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest));
});

gulp.task('manifest', function() {
  let file = 'manifest.json';
  let dest = 'build';

  return gulp.src(file)
    .pipe(template(packageJSON))
    .pipe(gulp.dest(dest));
});
