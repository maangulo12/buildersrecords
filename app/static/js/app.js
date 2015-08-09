var app = angular.module('app', ['ui.bootstrap', 'ngRoute', 'controllers']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '../partials/home.html',
            controller: 'HomeController'
        })
        .when('/signup', {
            templateUrl: '../partials/signup.html',
            controller: 'SignupController'
        })
        .otherwise({ redirectTo: '/' });
});
