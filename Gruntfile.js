module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    less: {
      development: {
        options: {
          paths: ['less']
        },
        files: {
          'css/popup.css': 'less/popup.less'
        }
      },
      production: {
        options: {
          paths: ['less'],
          yuicompress: true
        },
        files: {
          'build/css/style.css': 'less/main.less'
        }
      }
    },
    watch: {
      files: 'less/*.less',
      tasks: ['less:development']
    },
    jshint: {
      all: ['Gruntfile.js','js/*.js'],
      options: {
        asi: false,
        browser: true,
        eqeqeq: true,
        eqnull: true,
        laxcomma: true,
        node: true,
        strict: true,
        undef: true,
        unused: true,
        globals: {
          _: true,
          chrome: true
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['less:development','jshint']);
  grunt.registerTask('release', ['less:production']);
};
