angular.module('app.controllers', ['app.services'])

.controller('HomeController', function(authService, $scope, $location) {
    $scope.redirectToSignup = function() {
        $location.path('/signup');
    };

    $scope.redirectToLogin = function() {
        $location.path('/login');
    };

    console.log('RUNNING HOME CONTROLLER');

    var promise = authService.authenticate();
    var success = function(response) {
        console.log(response.data.token);
        // add token
    };
    var failure = function(response) {
        // delete token
    };
    promise.then(success, failure);
})

.controller('SignupController', function(usersService, $scope, $location) {
    $scope.redirectToSignup = function() {
        $location.path('/signup');
    };

    $scope.redirectToLogin = function() {
        $location.path('/login');
    };

    $scope.createAccount = function() {
        var promise = usersService.addUser($scope.signup.username,
                                           $scope.signup.password,
                                           $scope.signup.first_name,
                                           $scope.signup.last_name,
                                           $scope.signup.email);
        var success = function(response) {
            $scope.status_sent = response.status;
            $location.path('/userhome');
        };
        var failure = function(response) {
            $scope.status_sent = response.status;
        };
        promise.then(success, failure);
    };
})

.controller('EimadFormController', function($scope) {

});
