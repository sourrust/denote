/* eslint strict: "off" */

'use strict';

const gulp     = require('gulp');
const babel    = require('rollup-plugin-babel');
const jst      = require('gulp-amd-template');
const less     = require('gulp-less');
const eslint   = require('gulp-eslint');
const rename   = require('gulp-rename');
const rollup   = require('rollup');
const template = require('gulp-template');

const packageJSON = require('./package');

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
  const files = ['Gulpfile.js', 'js/**/*.js'];

  return gulp.src(files)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('watch', function() {
  gulp.watch('less/*.less', ['less']);
  gulp.watch('templates/*.html', ['jst']);
  gulp.watch('js/**/*.js', ['lint', 'translate']);
});

gulp.task('copy:vendor', function() {
  const dest  = 'build/js/lib';
  const files = [
    'node_modules/backbone/backbone.js',
    'node_modules/jquery/dist/jquery.js',
    'node_modules/requirejs/require.js',
    'node_modules/lodash/lodash.js'
  ];

  return gulp.src(files)
    .pipe(gulp.dest(dest));
});

gulp.task('copy:main', function() {
  const dest    = 'build';
  const options = { base: '.' };
  const files   = [
    'popup.html',
    'LICENSE',
    'js/contentscript.js',
    'js/configuration.js',
    'images/*'
  ];

  return gulp.src(files, options)
    .pipe(gulp.dest(dest));
});

gulp.task('copy', ['copy:vendor', 'copy:main']);

gulp.task('jst', function() {
  const dest = 'build/js/templates';

  return gulp.src('templates/*.html')
    .pipe(jst())
    .pipe(gulp.dest(dest));
});

gulp.task('translate', function() {
  return rollup.rollup({
    entry: 'js/popup.js',
    plugins: [
      babel({ presets: ['es2015-rollup'] })
    ]
  })
  .then(function(bundle) {
    const options = {
      globals: {
        backbone: 'Backbone',
        jquery: '$',
        underscore: '_'
      },
      format: 'amd',
      dest: 'build/js/popup.js',
      sourceMap: true
    };

    return bundle.write(options);
  });
});

gulp.task('manifest', function() {
  const file = 'manifest.json';
  const dest = 'build';

  return gulp.src(file)
    .pipe(template(packageJSON))
    .pipe(gulp.dest(dest));
});
