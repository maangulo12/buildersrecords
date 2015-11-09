angular.module('app.signup', [])

.config(function($stateProvider) {
    $stateProvider.state('signup', {
        url:         '/signup',
        templateUrl: 'angular/signup/signup.html',
        controller:  'SignupController'
    });
})
.controller('SignupController', function($scope, store, $state, UserService, MailService, AuthService) {
    init();

    function init() {
        store.remove('jwt');
    }
    $scope.createAccount = function() {
        // Add User
        UserService.addUser($scope.signup)
        .then(function(response) {
            // Send Registration Email to User
            MailService.sendRegistrationEmail($scope.signup);
            // Authenticate User
            AuthService.authenticate($scope.signup.username, $scope.signup.password)
            .then(function(response) {
                // Store Token
                AuthService.storeToken(response);
                $state.go('projects');
            }, function(error) {
                $state.go('login');
            });
        }, function(error) {
            $scope.signup_form.$invalid = true;
        });
    }
});
