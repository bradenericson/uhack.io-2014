'use strict';

var path = require('path');

var theme = require('./index.js');

var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

var folderMount = function folderMount(connect, point) {
	return connect.static(path.resolve(point));
};

exports = module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-livereload');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-regarde');
	grunt.loadNpmTasks('grunt-contrib-compass');

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: ['Gruntfile.js']
		},

		compass: {
			dist: {
				options: {
					sassDir: 'sass',
					cssDir: 'dist',
					outputStyle: 'expanded',
					require: 'zurb-foundation'
				}
			}
		},

		clean: {
			build: ['dist']
		},

		connect: {
			server: {
				options: {
					port: 3000,
					middleware: function(connect) {
						return [
							lrSnippet,
							folderMount(connect, 'public'),
							folderMount(connect, 'dist')
						];
					}
				}
			}
		},

		open: {
			server: {
				path: 'http://localhost:3000'
			}
		},

		regarde: {
			pub: {
				files: ['public/**/*', 'dist/**/*', 'assets/**/*'],
				tasks: ['livereload']
			},
			sass: {
				files: 'sass/**/*.scss',
				tasks: 'compass'
			}
		},
	});

	// Default task.
	grunt.registerTask('default', ['clean', 'compass', 'livereload-start', 'connect', 'open', 'regarde']);
};
