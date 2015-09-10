angular.module('app.signup', [

])
.config(function($stateProvider) {
    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'angular/signup/signup.html',
        controller: 'SignupController'
    })
})
.controller('SignupController', function(Restangular, $scope, store, $state) {
    store.remove('jwt');

    $scope.redirectToSignup = function() {
        $state.go('signup');
    }
    $scope.redirectToLogin = function() {
        $state.go('login');
    }
    $scope.createAccount = function() {
        // Add user
        Restangular.all('api/users').post({
            username  : $scope.signup.username,
            password  : $scope.signup.password,
            first_name: $scope.signup.first_name,
            last_name : $scope.signup.last_name,
            email     : $scope.signup.email
        }).then(function(user) {
            console.log('User Added.');

            // Send email registration
            Restangular.all('email_registration').post({
                email     : $scope.signup.email,
                first_name: $scope.signup.first_name,
                last_name : $scope.signup.last_name,
                username  : $scope.signup.username
            }).then(function(response) {
                console.log('Email Registration Sent.');
            });
        });
        // Authenticate user
        Restangular.all('auth').post({
            username: $scope.signup.username,
            password: $scope.signup.password
        }).then(function(auth) {
            store.set('jwt', auth.token);
            store.set('signed_user', $scope.signup.username);
            // store.set('signed_user_id', $scope.signup.username);
            console.log('User Authenticated.');
            $state.go('projects');
        });
    }
});
