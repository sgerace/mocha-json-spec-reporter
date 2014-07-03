module.exports = function(grunt) {

    var Reporter = require('./lib/reporter');

    process.env['mocha-json-spec-dest'] = './coverage/result.json';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mochaTest: {
            test: {
                options: {
                    reporter: Reporter
                },
                src: ['test/**/*.js']
            }
        },
        jshint: {
            kernel: {
                files: {
                    src: ['main.js', 'lib/**/*.js']
                },
            },
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');

    // Default task(s).
    // grunt.registerTask('default', ['uglify']);

    grunt.registerTask('test', ['mochaTest']);
};