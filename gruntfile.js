module.exports = function(grunt) {
    grunt.initConfig({

        uglify: {
            main: {
                files: {
                    'dist/js/perfmatters.js' : ['src/js/perfmatters.js']
                }
            }
        }, // uglify

        copy: {
            pizza: {
                src: 'src/views/js/main.js',
                dest: 'dist/views/js/main.js',
            }
        }, // copy

        cssmin: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'src/css',
                    src: ['*.css'],
                    dest: 'dist/css'
                }]
            },
            pizza: {
                options: {
                    shorthandCompacting: false,
                    roundingPrecision: -1,
                },
                files: {
                    'dist/views/css/pizza-styles.css': ['src/views/css/style.css', 'src/views/css/bootstrap-grid.css']
                }
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
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Tasks
    grunt.registerTask('default', ['uglify', 'cssmin', 'htmlmin', 'copy', 'watch']);
    grunt.registerTask('processMainHTML', ['htmlmin:main']);
    grunt.registerTask('processMainJS', ['uglify:main']);
    grunt.registerTask('processMainCSS', ['cssmin:main']);
    grunt.registerTask('processPizzaHTML', ['htmlmin:pizza']);
    grunt.registerTask('processPizzaJS', ['copy:pizza']);
    grunt.registerTask('processPizzaCSS', ['cssmin:pizza']);

}; // Wrapper function
