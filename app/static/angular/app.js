angular.module('app', [
    'ngMessages',
    'ui.validate',
    'ui.router',
    'angular-jwt',
    'angular-storage',
    'restangular',

    'app.directives',
    'app.services',
    'app.home',
    'app.login',
    'app.signup',
    'app.projects'
])
.config(function($urlRouterProvider, $locationProvider, jwtInterceptorProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);

    jwtInterceptorProvider.tokenGetter = function(store) {
        console.log(store.get('jwt'));
        return store.get('jwt');
    }
    $httpProvider.interceptors.push('jwtInterceptor');
})
.run(function($rootScope, $state, store, jwtHelper) {
    $rootScope.$on('$stateChangeStart', function(e, to) {
        if (to.data && to.data.requiresLogin) {
            if (!store.get('jwt') || jwtHelper.isTokenExpired(store.get('jwt'))) {
                e.preventDefault();
                $state.go('login');
            }
        }
    });
});
