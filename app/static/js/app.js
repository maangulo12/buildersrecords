angular.module('app', [
    'ngRoute',
    'ngMessages',
    'ui.validate',
    'angular-jwt',
    'angular-storage',
    'app.controllers',
    'app.directives'
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
        .when('/projects', {
            templateUrl: '../partials/projects.html',
            controller: 'ProjectsController'
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
});
