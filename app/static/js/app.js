angular.module('app', ['ngRoute',
                       'ngMessages',
                       'app.controllers',
                       'app.directives'])

.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '../partials/home.html',
            controller: 'HomeController'
        })
        .when('/signup', {
            templateUrl: '../partials/signup.html',
            controller: 'SignupController'
        })
        .when('/eimadForm', {
            templateUrl: '../partials/eimadForm.html',
            controller: 'EimadFormController'
        })
        .otherwise({ redirectTo: '/' });

    $locationProvider.html5Mode(true);
});
