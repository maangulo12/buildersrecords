angular.module('app.signup', [

])
.config(function($stateProvider) {
    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'angular/signup/signup.html',
        controller: 'SignupController'
    })
})
.controller('SignupController', function($http, $scope, store, $state) {
    store.remove('jwt');

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
            console.log('User Added.');

            // Send email registration
            $http.post('/email_registration', {
                email     : $scope.signup.email,
                first_name: $scope.signup.first_name,
                last_name : $scope.signup.last_name,
                username  : $scope.signup.username
            }).then(function(response2) {
                console.log('Email Registration Sent.');
            });
        });
        // Authenticate user
        $http.post('/auth', {
            username: $scope.signup.username,
            password: $scope.signup.password
        }).then(function(response) {
            // Add token to jwt variable
            store.set('jwt', response.data.token);
            store.set('signed_user', $scope.signup.username);
            // store.set('signed_user_id', $scope.signup.username);
            console.log('User Authenticated.');
            $state.go('projects');
        }, function(error) {
            // Error occurred, go to login
            $state.go('login');
        });
    }
});
