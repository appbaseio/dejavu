module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      files: [ "./*.js", "./actions/**/*.js"],
      tasks: [ 'browserify', 'uglify' ]
    },
    browserify: {
      'browser/appbase.js': ['appbase.js']
    },
    uglify: {
      'browser/appbase.min.js': ['browser/appbase.js']
    }
  })
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-contrib-uglify')
}