angular.module('app.signup', [])

.config(function($stateProvider) {
    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'angular/signup/signup.html',
        controller: 'SignupController'
    });
})
.controller('SignupController', function($scope, store, $state, $http, authService) {
    store.remove('jwt');

    $scope.createAccount = function() {
        $http.post('/api/users', {
            username  : $scope.signup.username,
            password  : $scope.signup.password,
            first_name: $scope.signup.first_name,
            last_name : $scope.signup.last_name,
            email     : $scope.signup.email
        }).then(function(response) {
            sendEmail();
            authenticate();
        }, function(error) {
            $scope.signup_form.$invalid = true;
        });
    }
    function sendEmail() {
        $http.post('/api/email/registration', {
            email     : $scope.signup.email,
            first_name: $scope.signup.first_name,
            last_name : $scope.signup.last_name,
            username  : $scope.signup.username
        });
    }
    function authenticate() {
        $http.post('/api/auth', {
            login   : $scope.signup.username,
            password: $scope.signup.password
        }).then(function(response) {
            authService.authHelper(response);
            $state.go('projects');
        }, function(error) {
            $state.go('login');
        });
    }
});
