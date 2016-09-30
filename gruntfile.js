module.exports = function (grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        
    });


    grunt.registerTask('build', [
        
    ]);

    grunt.registerTask('default', ['build']);
};