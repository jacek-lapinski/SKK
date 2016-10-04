module.exports = function (grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: './app/styles',
                    src: ['*.scss'],
                    dest: './build/styles',
                    ext: '.css'
                }]
            }
        },

        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: './build/styles',
                    src: ['*.css', '!*.min.css'],
                    dest: './build/styles',
                    ext: '.min.css'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('build', [
        'sass', 'cssmin'
    ]);

    grunt.registerTask('default', ['build']);
};