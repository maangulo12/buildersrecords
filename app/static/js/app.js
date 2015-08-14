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

// First directive
app.directive('usernameAvailability', function($http) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            ctrl.$asyncValidators.usernameAvailability = function(username) {
                // ngModel $asyncValidators error on browser
                $http.get('/api/users?q={"filters":[{"name":"username","op":"equals","val":"' + username + '"}]}')
                    .then(function(response) {
                        if (response.data.num_results == 0) {
                            ctrl.$setValidity('usernameAvailability', true);
                        }
                        else {
                            ctrl.$setValidity('usernameAvailability', false);
                        }
                    }, function(response) {
                        ctrl.$setValidity('usernameAvailability', false);
                        console.log('API ERROR')
                    });
            };
        }
    }
});
