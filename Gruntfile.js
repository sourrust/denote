module.exports = function(grunt) {
  'use strict';

  var config, tasks;

  config = grunt.file.readJSON('.secret/config.json');

  grunt.initConfig({
    jshintrc: grunt.file.readJSON('.jshintrc'),

    less: {
      compile: {
        options: {
          paths: ['less', 'bower_components/normalize-css']
        },
        files: {
          'css/popup.css': 'less/main.less'
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
          'templates/post.js': ['templates/post.html'],
          'templates/reblog.js': ['templates/reblog.html'],
          'templates/reply.js': ['templates/reply.html']
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
          },
          onBuildRead: function(moduleName, path, content) {
            var newContent;

            if(moduleName === 'models/note') {
              newContent =
                grunt.template.process(content, { data: config });
            } else {
              newContent = content;
            }

            return newContent;
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

  tasks = ['less', 'jst', 'copy', 'requirejs'];

  grunt.registerTask('default', ['jshint'].concat(tasks));
  grunt.registerTask('release', tasks);
};
