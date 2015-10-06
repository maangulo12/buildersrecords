// This is the main entry point of this Angular app.
// Here, I load all of the extensions and modules that are used in this app.
angular.module('app', [
    'ngMessages',
    'ui.validate',
    'ui.router',
    'angular-jwt',
    'angular-storage',
    'smart-table',
    'mgcrea.ngStrap',

    'app.auth',
    'app.directives',
    'app.home',
    'app.login',
    'app.signup',
    'app.projects',
    'app.dashboard',
    'app.funds',
    'app.expenditures',
    'app.budgeting'
])
.config(function($urlRouterProvider, $locationProvider, jwtInterceptorProvider, $httpProvider) {
    // These are the app configurations:

    // This basically tells Angular to route to / if URL does not match any
    $urlRouterProvider.otherwise('/');

    // This turns on html5mode
    $locationProvider.html5Mode(true);

    // This is the function that returns the JSON web token in every request
    // It adds the token to the header of every request
    jwtInterceptorProvider.tokenGetter = function(store) {
        return store.get('jwt');
    }
    // This is needed for the JSON web token to work
    $httpProvider.interceptors.push('jwtInterceptor');
})
.run(function($rootScope, $state, store, jwtHelper) {
    // This function is needed to restrict access to routes that require login
    // This function also checks if the token is expired. If it is, then Angular
    // would route to login page
    $rootScope.$on('$stateChangeStart', function(e, to) {
        if (to.data && to.data.requiresLogin) {
            if (!store.get('jwt') || jwtHelper.isTokenExpired(store.get('jwt'))) {
                e.preventDefault();
                $state.go('login');
            }
        }
    });
});
