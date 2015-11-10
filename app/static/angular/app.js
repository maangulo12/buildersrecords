// Main entry point of this Angular app
var app = angular.module('app', [
    'ngMessages',
    'ui.validate',
    'ui.router',
    'angular-jwt',
    'angular-storage',
    'smart-table',

    'app.directives',
    'app.services',
    'app.home',
    'app.login',
    'app.signup',
    'app.projects',
    'app.overview',
    'app.budget',
    'app.funds',
    'app.expenditures',
    'app.subcontractors'
]);

// App Configurations
app.config(function($urlRouterProvider, $locationProvider, jwtInterceptorProvider, $httpProvider) {
    // Tells Angular to route to / if URL does not match any
    $urlRouterProvider.otherwise('/');

    // Turns on html5mode
    $locationProvider.html5Mode(true);

    // Returns the JSON web token in every request
    // It adds the token to the header of every request
    jwtInterceptorProvider.tokenGetter = function(store) {
        return store.get('jwt');
    }
    $httpProvider.interceptors.push('jwtInterceptor');
});

// App Run
app.run(function($rootScope, $state, store, jwtHelper) {
    // Restricts access to routes that require login
    // Also checks if the token is expired
    // If expired, then Angular would route to login page
    $rootScope.$on('$stateChangeStart', function(e, to) {
        if (to.data && to.data.requiresLogin) {
            if (!store.get('jwt') || jwtHelper.isTokenExpired(store.get('jwt'))) {
                e.preventDefault();
                $state.go('login');
            }
        }
    });
});
