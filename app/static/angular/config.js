(function() {
    'use strict';

    angular
        .module('app')
        .config(config);

    config.$inject = ['$urlRouterProvider', '$locationProvider', 'jwtInterceptorProvider', '$httpProvider'];

    function config($urlRouterProvider, $locationProvider, jwtInterceptorProvider, $httpProvider) {
        // Route to '/' if url not found
        $urlRouterProvider.otherwise('/');
        // Turn on html5mode
        $locationProvider.html5Mode(true);
        // Returns the JSON web token in every request
        // Adds the token to the header of every request
        jwtInterceptorProvider.tokenGetter = function(store) {
            return store.get('jwt');
        }
        $httpProvider.interceptors.push('jwtInterceptor');
    }
})();
