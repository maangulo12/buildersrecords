var app = angular.module('app', ['ngRoute', 'ngMessages', 'controllers']);

app.config(function($routeProvider, $locationProvider) {
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

app.directive('usernameAvailability', function($http, $q) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            ctrl.$asyncValidators.usernameAvailability = function(username) {

                var promise = $http.get('/api/users?q={"filters":[{"name":"username","op":"equals","val":"' + username + '"}]}');

                var success = function(response) {
                    if (response.data.num_results == 0) {
                        ctrl.$setValidity('usernameAvailability', true);
                    }
                    else {
                        ctrl.$setValidity('usernameAvailability', false);
                        return $q.reject(response);
                    }
                }
                var failure = function(response) {
                    ctrl.$setValidity('usernameAvailability', false);
                    return $q.reject(response);
                }

                return promise.then(success, failure);
            };
        }
    }
});

app.directive('emailAvailability', function($http, $q) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            ctrl.$asyncValidators.emailAvailability = function(email) {

                var promise = $http.get('/api/users?q={"filters":[{"name":"email","op":"equals","val":"' + email + '"}]}');

                var success = function(response) {
                    if (response.data.num_results == 0) {
                        ctrl.$setValidity('emailAvailability', true);
                    }
                    else {
                        ctrl.$setValidity('emailAvailability', false);
                        return $q.reject(response);
                    }
                }
                var failure = function(response) {
                    ctrl.$setValidity('emailAvailability', false);
                    return $q.reject(response);
                }

                return promise.then(success, failure);
            };
        }
    }
});
