angular.module('app', [
    'ngRoute',
    'ngMessages',
    'ui.validate',
    'angular-jwt',
    'angular-storage',
    'app.controllers',
    'app.directives',
    'app.services'
])

.config(function($routeProvider, $locationProvider, $httpProvider, jwtInterceptorProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '../partials/home.html',
            controller: 'HomeController'
        })
        .when('/signup', {
            templateUrl: '../partials/signup.html',
            controller: 'SignupController'
        })
        .when('/login', {
            templateUrl: '../partials/login.html',
            controller: 'LoginController'
        })
        .when('/eimadForm', {
            templateUrl: '../partials/eimadForm.html',
            controller: 'EimadFormController'
        })
        .otherwise({
            redirectTo: '/'
        });
    $locationProvider.html5Mode(true);

    jwtInterceptorProvider.tokenGetter = function(store) {
        return store.get('jwt');
    }
    $httpProvider.interceptors.push('jwtInterceptor');
})

.run(function(authService, store) {
    var promise = authService.authenticate();
    var success = function(response) {
        store.set('jwt', response.data.token);
    };
    var failure = function(response) {
        store.remove('jwt');
    };
    promise.then(success, failure);
});
