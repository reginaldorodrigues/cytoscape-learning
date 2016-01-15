/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
    /**
     * The `build_dir` folder is where our projects are compiled during
     * development and the `compile_dir` folder is where our app resides once it's
     * completely built.
     */
    build_dir: 'build',

    /**
     * This is a collection of file patterns that refer to our app code (the
     * stuff in `src/`). These file paths are used in the configuration of
     * build tasks. `js` is all project javascript, less tests. `ctpl` contains
     * our reusable components' (`src/common`) template HTML files, while
     * `atpl` contains the same, but for our app's code. `html` is just our
     * main HTML file, `less` is our main stylesheet, and `unit` contains our
     * app's unit tests.
     */
    app: {
        js: [
            'src/app/app.js',
            'src/app/**/*.mdl.js',
            'src/app/**/*.js',
            'src/assets/js/*.js'
        ],
        nounits: [
            '!src/app/**/*.spec.js',
            '!src/app/**/*.e2e.js'
        ],
        units: [
            'src/app/**/*.spec.js'
        ],
        e2e: [
            'src/app/**/*.e2e.js'
        ],
        tpls: [
            'src/app/**/*.html',
            '!src/*.html'
        ],
        html: ['src/*.html'],
        less: ['src/less/main.less'],
        css: ['src/assets/*.css',
			   'src/assets/**/*.css',
			   '!src/assets/fonts/Icons/demo/*.*'],
        config: ['src/app/configuration.json']

    },

    /**
     * This is the same as `app_files`, except it contains patterns that
     * reference vendor code (`vendor/`) that we need to place into the build
     * process somewhere. While the `app_files` property ensures all
     * standardized files are collected for compilation, it is the user's job
     * to ensure non-standardized (i.e. vendor-related) files are handled
     * appropriately in `vendor_files.js`.
     *
     * The `vendor_files.js` property holds files to be automatically
     * concatenated and minified with our project source files.
     *
     * The `vendor_files.css` property holds any CSS files to be automatically
     * included in our app.
     */
    vendors: {
        units: [
            'src/vendor/jquery/dist/jquery.js',
			'src/vendor/angular-mocks/angular-mocks.js',
        ],
        js: [
            'src/vendor/angular/angular.js',
            'src/vendor/angular-animate/angular-animate.min.js',
            'src/vendor/angular-bindonce/bindonce.js',
            'src/vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
            'src/vendor/angular-resource/angular-resource.js',
            'src/vendor/angular-messages/angular-messages.min.js',
            'src/vendor/angular-ui-router/release/angular-ui-router.js',
            'src/vendor/angular-ui-utils/modules/route/route.js',
            'src/vendor/angular-webstorage/angular-webstorage.js',
			'src/vendor/lodash/lodash.js',
            'src/vendor/moment/moment.js',
			'src/vendor/jquery/dist/jquery.js',
			'src/vendor/bootstrap/dist/js/bootstrap.js',
            'src/vendor/highstock/highstock.js',
            'src/vendor/angular-toastr/dist/angular-toastr.min.js',
            'src/vendor/angular-toastr/dist/angular-toastr.tpls.min.js',
            'src/vendor/cytoscape/dist/cytoscape.min.js'
        ],
        ext: [

        ],
        css: [
            'src/vendor/angular-toastr/dist/angular-toastr.min.css'
        ],
        assets: [

        ],
        images: [

        ],
        fonts: [
			'src/vendor/font-awesome/fonts/*.*',
			'src/vendor/bootstrap/dist/fonts/*.*'
        ]

    }
};
