module.exports = function (grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        wiredep: {
            task: {
                src: [
                    'app/index.html'
                ],
                options: {
                    // https://github.com/taptapship/wiredep#configuration 
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-wiredep');

    grunt.registerTask('build', [
        'wiredep'
    ]);

    grunt.registerTask('default', ['build']);
};