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

                // Success function
                var success = function(response) {
                    if (response.data.num_results == 0) {
                        ctrl.$setValidity('usernameAvailability', true);
                    }
                    else {
                        ctrl.$setValidity('usernameAvailability', false);
                        return $q.reject(response);
                    }
                }
                // Failure function
                var failure = function(response) {
                    ctrl.$setValidity('usernameAvailability', false);
                    return $q.reject(response);
                }

                return promise.then(success, failure);
            };
        }
    }
});
