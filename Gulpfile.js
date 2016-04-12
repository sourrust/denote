/* jshint node: true */
'use strict';

let gulp       = require('gulp');
let babel      = require('gulp-babel');
let jscs       = require('gulp-jscs');
let jshint     = require('gulp-jshint');
let jst        = require('gulp-lodash-template');
let less       = require('gulp-less');
let rename     = require('gulp-rename');
let sourcemaps = require('gulp-sourcemaps');
let stylish    = require('jshint-stylish');
let template   = require('gulp-template');

let packageJSON = require('./package');

gulp.task('default',
  ['lint', 'less', 'jst', 'copy', 'manifest', 'translate']
);

gulp.task('less', function() {
  const dest    = 'build/css';
  const options = {
    paths: ['less', 'node_modules/normalize.css']
  };

  return gulp.src('less/main.less')
    .pipe(less(options))
    .pipe(rename('popup.css'))
    .pipe(gulp.dest(dest));
});

gulp.task('lint', function() {
  const files    = ['Gulpfile.js', 'js/**/*.js'];
  const reporter = jshint.reporter(stylish);

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
  const dest  = 'build/js/lib';
  const files = [ 'node_modules/backbone/backbone.js'
                , 'node_modules/jquery/dist/jquery.js'
                , 'node_modules/requirejs/require.js'
                , 'node_modules/lodash/lodash.js'
                ];

  return gulp.src(files)
    .pipe(gulp.dest(dest));
});

gulp.task('copy:main', function() {
  const dest    = 'build';
  const options = { base: '.' };
  const files   = [ 'popup.html'
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
  const dest = 'build/js/templates';

  return gulp.src('templates/*.html')
    .pipe(jst({ amd: true }))
    .pipe(gulp.dest(dest));
});

gulp.task('translate', function() {
  const dest    = 'build/js';
  const options = { ignore: 'js/con(tentscript|figuration).js' };
  const files   = [ 'js/**/*.js'
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
  const file = 'manifest.json';
  const dest = 'build';

  return gulp.src(file)
    .pipe(template(packageJSON))
    .pipe(gulp.dest(dest));
});
