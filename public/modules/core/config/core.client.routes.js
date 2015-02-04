'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        // Redirect to home view when route not found
        $urlRouterProvider.otherwise('/videos');

        // Home state routing
        $stateProvider.
            state('tv', {
                url: '/tv',
                templateUrl: 'modules/core/views/tv.client.view.html'
            }).
            state('remote', {
                url: '/remote/:tvId',
                templateUrl: 'modules/core/views/remote.client.view.html'
            });
    }
]);
