module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    jshintrc: grunt.file.readJSON('.jshintrc'),

    less: {
      compile: {
        options: {
          paths: ['less']
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
      grunt: {
        src: 'Gruntfile.js',
        options: {
          node: true
        }
      },
      js: {
        src: [ 'js/*.js'
             , 'js/{collection,model,view}s/*.js'
             ],
        options: {
          browser: true,
          globals: {
            chrome: true,
            define: true,
            require: true
          }
        }
      }
    },
    copy: {
      main: {
        files: [
          { src: 'js/**', dest: 'build/' },
          { src: ['popup.html', 'manifest.json', 'LICENSE']
          , dest: 'build/'
          },
          { src: ['css/*'], dest: 'build/'},
          { src: ['images/*'], dest: 'build/'},
          { src: ['templates/*.js'], dest: 'build/' }
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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['less','jst','jshint']);
  grunt.registerTask('release', ['less','jst', 'copy']);
};
