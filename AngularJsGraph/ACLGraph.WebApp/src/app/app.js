angular.module('acl.research', [
        //Common

        //Service	

        //Modules    		
        'acl.modules.research',

        //3rd party
        'ui.bootstrap',
        'ui.router',
        'webStorageModule',
])
    .constant('CONFIG', {
        apiBasePath: "http://localhost:65362/api/web"
    })
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when('/', '/research/cytoscape');
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('root', {
                url: '/'
            });
    })
    .run(function run($rootScope, $http, webStorage) {
    
    $(document).keydown(function (e) {//prevent from navigation when backspace is clicked on not focuesed input
        if (e.keyCode === 8 && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    });
});

