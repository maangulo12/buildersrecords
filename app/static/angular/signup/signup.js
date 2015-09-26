angular.module('app.signup', [])

.config(function($stateProvider) {
    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'angular/signup/signup.html',
        controller: 'SignupController'
    });
})
.controller('SignupController', function($scope, store, $state, $http, authService) {
    init();

    function init() {
        store.remove('jwt');
    }
    $scope.redirectToSignup = function() {
        $state.go('signup');
    }
    $scope.redirectToLogin = function() {
        $state.go('login');
    }
    $scope.createAccount = function() {
        // Add user
        $http.post('/api/users', {
            username  : $scope.signup.username,
            password  : $scope.signup.password,
            first_name: $scope.signup.first_name,
            last_name : $scope.signup.last_name,
            email     : $scope.signup.email
        }).then(function(response) {
            // Send email registration
            $http.post('/email_registration', {
                email     : $scope.signup.email,
                first_name: $scope.signup.first_name,
                last_name : $scope.signup.last_name,
                username  : $scope.signup.username
            }).then(function(response2) {
                console.log('Email Registration Sent.');
            });
        }, function(error) {
            $scope.signup_form.$invalid = true;
        });
        // Authenticate user
        $http.post('/auth', {
            login: $scope.signup.username,
            password: $scope.signup.password
        }).then(function(response) {
            authService.authHelper(response);
            $state.go('projects');
        }, function(error) {
            $state.go('login');
        });
    }
});
