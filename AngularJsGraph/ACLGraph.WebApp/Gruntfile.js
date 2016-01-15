/// <vs SolutionOpened='build:dev' />
var path = require('path'),
    dateFormat = require('dateformat');

module.exports = function (grunt) {

    /**
     * Load required Grunt tasks. These are installed based on the versions listed
     * in `package.json` when you do `npm install` in this directory.
     */
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-ngmin');
    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-injector');


    grunt.registerTask('default', ['build:dev', 'copy:webapp']);
    //grunt.registerTask('default', ['build:dev']);

    /**
     * Load in our build configuration file.
     */
    var userConfig = require('./build.config.js');

    /**
     * This is the configuration object Grunt uses to give each plugin its
     * instructions.
     */
    var buildToken = dateFormat(new Date(), 'yyyy_mm_dd_HHMM'),
        taskConfig = {
            /**
             * We read in our `package.json` file so we can access the package name and
             * version. It's already there, so we don't repeat ourselves here.
             */
            pkg: (function () {
                var data = grunt.file.readJSON("package.json");
                data.buildName = data.name + '_' + buildToken;
                return data;
            }()),

            /**
             * `less` handles our LESS compilation and uglification automatically.
             * Only our `main.less` file is included in compilation; all other files
             * must be imported from this file.
             */
            less: {
                build: {
                    src: ['<%= app.less %>'],
                    dest: '<%= build_dir %>/assets/<%= pkg.name %>.css',
                    options: {
                        compile: true,
                        compress: false,
                        noUnderscores: false,
                        noIDs: false,
                        zeroUnits: false
                    },
                    src: ['<%= vendors.css %>'],
                    dest: '<%= build_dir %>/vendor/<%= pkg.name %>_vendors.css',
                    options: {
                        compile: true,
                        compress: false,
                        noUnderscores: false,
                        noIDs: false,
                        zeroUnits: false
                    },
                },

                dev: {
                    src: ['<%= app.less %>'],
                    dest: 'src/assets/<%= pkg.name %>.css',
                    options: {
                        compile: true,
                        compress: false,
                        noUnderscores: false,
                        noIDs: false,
                        zeroUnits: false
                    }
                }
                //build: {
                //    src: [ '<%= app.less %>' ],
                //    dest: 'build/assets/css/<%= pkg.buildName %>.css',
                //    options: {
                //        compress: true,
                //        strictImports: true,
                //        optimization: 2
                //    }
                //}
            },

            /**
             * `jshint` defines the rules of our linter as well as which files we
             * should check. This file, all javascript sources, and all our unit tests
             * are linted based on the policies listed in `options`. But we can also
             * specify exclusionary patterns by prefixing them with an exclamation
             * point (!); this is useful when code comes from a third party but is
             * nonetheless inside `src/`.
             */
            jshint: {
                options: {
                    jshintrc: '.jshintrc'
                },
                app: {
                    src: [
                        '<%= app.js %>',
                        '<%= app.nounits %>'
                    ]
                },
                tests: {
                    src: [
                        '<%= app.units %>',
                        '<%= app.e2e %>'
                    ]
                },
                gruntfile: [
                    'Gruntfile.js'
                ],
            },

            /**
             * The Karma configurations.
             */
            karma: {
                options: {
                    files: [
                        '<%= vendors.js %>',
                        '<%= vendors.units %>',
                        '<%= app.js %>',
                        '<%= app.units %>'

                    ],
                    exclude: userConfig.app.e2e,

                    configFile: 'karma/karma-unit.js'
                },
                dev: {
                    logLevel: 'INFO'
                },
                ci: {
                    logLevel: 'WARN',
                    reporters: ['coverage', 'dots', 'teamcity'],
                    coverageReporter: {
                        type: 'teamcity'
                    }
                },
                ci_add: {
                    logLevel: 'WARN',
                    reporters: ['coverage', 'dots', 'teamcity'],
                    coverageReporter: {
                        type: 'teamcity'
                    }
                },
            },
            /**
             * The Protractor configuration
             */
            protractor: {
                dev: {
                    configFile: 'protractor/e2e.conf.js',
                    keepAlive: true,
                    noColor: false
                },
                ci: {
                    configFile: 'protractor/e2e.ci.js',
                    keepAlive: true,
                    noColor: false
                },
                ci_add: {
                    configFile: 'protractor/e2e.ci_add.js',
                    keepAlive: true,
                    noColor: false
                }
            },

            injector: {
                options: {

                },
                index: {
                    options: {
                        ignorePath: ['src/', 'ext/'],
                        addRootSlash: false
                    },
                    files: {
                        'src/index.html': [
                            '<%= vendors.js %>',
							'<%= vendors.ext %>',
                            '<%= vendors.css %>',
                            '<%= app.js %>',
                            '<%= app.nounits %>',
                            '<%= app.css %>',
                            '<%= app.js %>'
                        ]
                    }
                },
                indexbuild: {
                    options: {
                        ignorePath: 'build/',
                        addRootSlash: false
                    },
                    files: {
                        'build/index.html': [
                        'build/vendor/**/*.js',
                        'build/app/**/*.js',
                        'build/vendor/*.css',
                        'build/assets/**/*.css'
                        ]
                    }
                }
            },
            clean: {
                options: {
                    force: true
                },
                build: ['<%= build_dir %>'],
                css: ['src/assets/css/<%= pkg.name %>*.css']
            },
            copy: {
                webapp: {
                    files: [
                        {
                            src: ['<%= build_dir %>/**'],
                            dest: '../src/main/webapp/',
                            extend: true,
                            nonull: true
                        }
                    ]
                },
                extNpm: {
                    files: [
                        {
                            src: ['**/*.*'],
                            cwd: 'ext/node_modules',
                            expand: true,
                            dest: 'node_modules/',
                            extend: true,
                            nonull: true

                        }
                    ]
                },
                dev: {
                    files: [
                        {
                            src: [
                                '<%= app.js %>',
                                '<%= app.nounits %>',
                                '<%= app.tpls %>',
                                '<%= app.html %>',
                                '<%= vendors.assets %>',
                                'src/assets/**/*.*',
                                '!src/assets/*.md',
                                '<%= vendors.fonts %>'
                            ],
                            dest: '<%= build_dir %>/',
                            nonull: true,
                            rename: function (dest, src) {
                                var dirs = src.split('/').slice(1);
                                return path.join(dest, dirs.join(path.sep));
                            },
                            expand: true
                        },
                        {
                            src: [
                                '<%= vendors.js %>',
                                '<%= vendors.ext %>',
                                '<%= vendors.css %>',
                                '<%= vendors.assets %>'
                            ],
                            dest: '<%= build_dir %>/',
                            nonull: true,
                            rename: function (dest, src) {
                                var dirs = src.split('/').slice(1);
                                return path.join(dest, dirs.join(path.sep));
                            },
                            expand: true
                        }
                    ]
                },
                build: {
                    files: [
                        {
                            src: [
                                'src/*.html',
                                'src/assets/**/*.*',
                                '!src/assets/fonts/Icons/demo/*.*',
                                '!src/assets/*.md'
                            ],
                            dest: '<%= build_dir %>/',
                            nonull: true,
                            rename: function (dest, src) {
                                var dirs = src.split('/').slice(1);
                                return path.join(dest, dirs.join(path.sep));
                            },
                            expand: true
                        }
                    ],
                },
                buildImages: {
                    files: [
                       {
                           src: [
                               '<%= vendors.images %>'
                           ],
                           dest: '<%= build_dir %>/vendor/images',
                           nonull: true,
                           rename: function (dest, src) {
                               var dirs = src.split('/').slice(1);

                               var fileName = dirs[dirs.length - 1];
                               return path.join(dest, fileName);
                           },
                           expand: true
                       }
                    ]
                },
                buildFonts: {
                    files: [
                       {
                           src: [
                               '<%= vendors.fonts %>'
                           ],
                           dest: '<%= build_dir %>/vendor/fonts',
                           nonull: true,
                           rename: function (dest, src) {
                               var dirs = src.split('/').slice(1);

                               var fileName = dirs[dirs.length - 1];
                               return path.join(dest, fileName);
                           },
                           expand: true
                       }
                    ]
                },
                buildAssets: {
                    files: [
                       {
                           src: [
                               '<%= vendors.assets %>'
                           ],
                           dest: '<%= build_dir %>/vendor',
                           nonull: true,
                           rename: function (dest, src) {
                               var dirs = src.split('/').slice(1);

                               var fileName = dirs[dirs.length - 1];
                               return path.join(dest, fileName);
                           },
                           expand: true
                       }
                    ]
                },
                config: {
                    files: [
                        {
                            src: ['<%= app.config %>'],
                            dest: '<%= build_dir %>/app/configuration.json'
                        }
                    ]
                },
            },
            watch: {
                refresh: {
                    files: [
                        '<%= app.js %>',
                        '<%= app.tpls %>',
                        '<%= app.less %>',
                        'src/app/**/*.less',
                        'src/less/*.less'
                    ],
                    options: {
                        spawn: false
                    },
                    tasks: ['less:dev', 'injector:index', 'copy:dev', 'copy:config', 'concat']
                }
            },
            compress: {
                dev: {
                    options: {
                        archive: 'build/EBO_auto_build.zip'
                    },
                    cwd: 'build/',
                    expand: true,
                    src: ['**']
                }
            },
            concat: {
                options: {
                    separator: ';'
                },
                app: {
                    dest: '<%= build_dir %>/app/<%= pkg.buildName %>.js',
                    src: [
                        '<%= app.js %>',
                        '<%= app.nounits %>'
                    ]
                },
                vendors: {
                    dest: '<%= build_dir %>/vendor/<%= pkg.buildName %>_vendor.js',
                    src: ['<%= vendors.js %>',
                           '<%= vendors.units %>',
                           '<%= vendors.ext %>']
                }
            },
            ngAnnotate: {
                options: {
                    singleQuotes: true
                },
                app: {
                    files: [
                        {
                            expand: true,
                            src: ['<%= build_dir %>/app/<%= pkg.buildName %>.js']
                        }
                    ]
                }
            },
            uglify: {
                options: {},
                app: {
                    files: {
                        '<%= build_dir %>/app/<%= pkg.buildName %>.js': '<%= build_dir %>/app/<%= pkg.buildName %>.js',
                        '<%= build_dir %>/vendor/<%= pkg.buildName %>_vendor.js': '<%= build_dir %>/vendor/<%= pkg.buildName %>_vendor.js'
                    }
                }
            },
            ngtemplates: {
                options: {
                    htmlmin: {
                        collapseWhitespace: true,
                        collapseBooleanAttributes: true,
                        removeAttributeQuotes: true,
                        removeEmptyAttributes: true,
                        removeRedundantAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true
                    },
                    module: 'ipg.cfe',
                    url: function (src, ang) {
                        var dirs = src.split('/').slice(1);
                        return (dirs.join(path.sep));
                    }
                },
                ipg_ebo: {
                    src: ['<%= app.tpls %>', '<%= app.html %>'],
                    dest: '<%= build_dir %>/app/<%= pkg.buildName %>_templates.js'
                }

            },

            buildless: {
                files: [
                    'src/**/*.less'
                ],
                options: {
                    spawn: false
                },
                tasks: ['less', 'index:devbuild']
            },

            build: {
                code: {
                    tasks: ['less:dev', 'injector:index']
                },
                dev: {
                    tasks: ['injector:index', 'watch']
                    ////tasks: ['clean', 'copy:extNpm','less:dev', 'injector:index', 'copy:dev', 'copy:config', 'concat', 'watch']
                },
                qa: {
                    tasks: ['clean', 'copy:build', 'copy:buildImages', 'copy:buildFonts', 'copy:buildAssets', 'less:build', 'copy:config', 'ngtemplates', 'concat', 'injector:indexbuild']
                },
                prod: {
                    tasks: ['clean', 'copy:build', 'copy:config', 'copy:buildImages', 'copy:buildFonts', 'copy:buildAssets', 'less:build', 'ngtemplates', 'concat', 'injector:indexbuild', 'ngAnnotate', 'uglify']
                },
                tc: {
                    tasks: ['clean', 'less:dev', 'injector:index', 'copy:dev', 'copy:config', 'concat']
                }
            },
            test: {
                dev: {
                    tasks: ['jshint', 'karma:dev']
                },
                ci: {
                    tasks: ['jshint', 'karma:ci', 'e2e:ci']
                },
                ci_add: {
                    tasks: ['jshint', 'karma:ci', 'e2e:ci_add']
                }
            }
        };




    grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));

    grunt.registerMultiTask('build', 'Build project', function () {
        grunt.task.run(this.data.tasks);
    });

    grunt.registerMultiTask('test', 'Test project', function () {
        grunt.task.run(this.data.tasks);
    });

    grunt.registerTask('e2e:dev', ['protractor:dev']);
    grunt.registerTask('e2e:ci', ['protractor:ci']);
    grunt.registerTask('e2e:ci_add', ['protractor:ci_add']);

};
