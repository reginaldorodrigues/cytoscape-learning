angular.module('acl.modules.research', [
    'ui.router'
])
.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state('graph', {
            url: '/research/gojs',
            controller: 'gojsCtrl',
            templateUrl: 'app/modules/research/gojs/gojs.html'
        })
        .state('cytoscape', {
            url: '/research/cytoscape',
            controller: 'cytoscapeCtrl',
            templateUrl: 'app/modules/research/cytoscape/cytoscape.html'
        })
}]);
