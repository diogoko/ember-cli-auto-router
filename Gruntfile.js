module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-es6-module-transpiler');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: ['tmp/'],

    transpile: {
      main: {
        type: 'cjs',
        expand: true,
        src: ['vendor/ember-cli-auto-router.js'],
        dest: 'tmp/'
      }
    },

    mochaTest: {
      test: {
        options: 'spec'
      },
      src: ['test/test.js']
    }
  });

  grunt.registerTask('default', ['clean', 'transpile', 'mochaTest']);
};
