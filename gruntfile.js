module.exports = function(grunt) {
    grunt.initConfig({

        uglify: {
            main: {
                files: {
                    'dist/js/perfmatters.min.js' : ['src/js/perfmatters.js']
                }
            },
            pizza: {
                files: {
                    'dist/views/js/main.min.js' : ['src/views/js/main.js']
                }
            }
        }, // uglify

        cssmin: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'src/css',
                    src: ['*.css'],
                    dest: 'dist/css',
                    ext: '.min.css'
                }]
            },
            pizza: {
                files: [{
                    expand: true,
                    cwd: 'src/views/css',
                    src: ['*.css'],
                    dest: 'dist/views/css',
                    ext: '.min.css'
                }]
            }
        }, // cssmin

        htmlmin: {
            main: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/index.html': 'src/index.html',
                    'dist/project-2048.html': 'src/project-2048.html',
                    'dist/project-mobile.html': 'src/project-mobile.html',
                    'dist/project-webperf.html': 'src/project-webperf.html',
                }
            },
            pizza: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/views/pizza.html': 'src/views/pizza.html',
                }
            }
        }, // htmlmin

        watch: {
            options: {
                spawn: true
            },
            mainJS: {
                files: ['src/js/*.js'],
                tasks: ['processMainJS']
            },
            pizzaJS: {
                files: ['src/views/js/*.js'],
                tasks: ['processPizzaJS']
            },
            mainCSS: {
                files: ['src/css/*.css'],
                tasks: ['processMainCSS']
            },
            pizzaCSS: {
                files: ['src/views/css/*.css'],
                tasks: ['processPizzaCSS']
            },
            mainHTML: {
                files: ['src/*.html'],
                tasks: ['processMainHTML']
            },
            pizzaHTML: {
                files: ['src/views/*.html'],
                tasks: ['processPizzaHTML']
            }

        } // watch


    }); // InitConfig

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Tasks
    grunt.registerTask('default', ['uglify', 'cssmin', 'htmlmin', 'watch']);
    grunt.registerTask('processMainHTML', ['htmlmin:main']);
    grunt.registerTask('processMainJS', ['uglify:main']);
    grunt.registerTask('processMainCSS', ['cssmin:main']);
    grunt.registerTask('processPizzaHTML', ['htmlmin:pizza']);
    grunt.registerTask('processPizzaJS', ['uglify:pizza']);
    grunt.registerTask('processPizzaCSS', ['cssmin:pizza']);

}; // Wrapper function
