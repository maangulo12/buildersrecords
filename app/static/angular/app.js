var app = angular.module('app', [
    'ngMessages',
    'ui.validate',
    'ui.router',
    'angular-jwt',
    'angular-storage',
    'smart-table',

    'app.directives',
    'app.services',
    'app.utility',
    'app.home',
    'app.login',
    'app.signup',
    'app.account',
    'app.projects',
    'app.projects.overview',
    'app.projects.budget',
    'app.projects.funds',
    'app.projects.expenditures',
    'app.projects.subcontractors'
]);

app.config(function($urlRouterProvider, $locationProvider, jwtInterceptorProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);

    // Returns the JSON web token in every request
    // It adds the token to the header of every request
    jwtInterceptorProvider.tokenGetter = function(store) {
        return store.get('jwt');
    }
    $httpProvider.interceptors.push('jwtInterceptor');
});

app.run(function($rootScope, $state, store, jwtHelper) {
    // Restricts access to routes that require login
    // Also checks if the token is expired
    $rootScope.$on('$stateChangeStart', function(e, to) {
        if (to.data && to.data.requiresLogin) {
            if (!store.get('jwt') || jwtHelper.isTokenExpired(store.get('jwt'))) {
                e.preventDefault();
                $state.go('login');
            }
        }
    });
});
