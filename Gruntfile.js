module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    jshintrc: grunt.file.readJSON('.jshintrc'),

    less: {
      compile: {
        options: {
          paths: ['less', 'bower_components/normalize-css']
        },
        files: {
          'css/popup.css': 'less/popup.less'
        }
      }
    },
    watch: {
      less: {
        files: 'less/*.less',
        tasks: 'less'
      },
      jshint: {
        files: [ 'Gruntfile.js'
               , 'js/**/*.js'
               , '!js/lib/*'
               ],
        tasks: 'jshint'
      }
    },
    jshint: {
      options: '<%= jshintrc %>',
      grunt: { src: 'Gruntfile.js' },
      js: {
        src: [ 'js/*.js'
             , 'js/{collection,model,view}s/*.js'
             ],
        options: {
          browser: true,
          globals: { chrome: true }
        }
      }
    },
    copy: {
      bower: {
        files: [
          { src: [ 'requirejs/require.js' ]
          , cwd: 'bower_components/'
          , expand: true
          , flatten: true
          , dest: 'build/js/lib/'
          }
        ]
      },
      main: {
        files: [
          { src: [ 'popup.html'
                 , 'manifest.json'
                 , 'LICENSE'
                 , 'js/contentscript.js'
                 , 'css/*'
                 , 'images/*'
                 ]
          , dest: 'build/'
          }
        ]
      }
    },
    jst: {
      compile: {
        options: {
          amd: true,
          namespace: false
        },
        files: {
          'templates/note.js': ['templates/note.html'],
          'templates/post.js': ['templates/post.html']
        }
      }
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: 'js',
          name: 'popup',
          out: 'build/js/popup.js',
          cjsTranslate: true,
          optimize: 'none',
          shim: {
            backbone: {
              deps: ['underscore', 'jquery'],
              exports: 'Backbone'
            }
          },
          paths: {
            backbone: '../bower_components/backbone/backbone',
            jquery: '../bower_components/jquery/jquery',
            underscore: '../bower_components/lodash/dist/lodash.underscore',
            template: '../templates'
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-watch');

  var tasks = ['less','jst', 'copy','requirejs'];

  grunt.registerTask('default', tasks.concat('jshint'));
  grunt.registerTask('release', tasks);
};
