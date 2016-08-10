module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			options: {
				atBegin: true
			},
			files: [ './src/**/*.js'],
			tasks: [ 'babel', 'browserify', 'uglify' ]
		},
		babel: {
			options: {
				loose: 'all'
			},
			dist: {
				files: [{
						expand: true,
						cwd: 'src',
						dest: 'dist',
						ext: '.js',
						src: ['**/*.js']
				}]
			}
		},
		browserify: {
			dist: {
				files: {
					'browser/appbase.js': ['dist/appbase.js']
				}
			}
		},
		uglify: {
			'browser/appbase.min.js': ['browser/appbase.js']
		},
		mochaTest: {
			test: {
				options: {
					reporter: 'spec'
				},
				src: ['test/**/*.js']
			}
		}
	})

	grunt.loadNpmTasks('grunt-babel')
	grunt.loadNpmTasks('grunt-contrib-watch')
	grunt.loadNpmTasks('grunt-browserify')
	grunt.loadNpmTasks('grunt-contrib-uglify')
	grunt.loadNpmTasks('grunt-mocha-test')

	grunt.registerTask('default', [ 'babel', 'browserify', 'uglify' ])
	grunt.registerTask('test', [ 'mochaTest' ])
}