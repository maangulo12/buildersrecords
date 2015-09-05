angular.module('app.controllers', [
    'app.services'
])

.controller('HomeController', function($scope, $location) {
    redirects($scope, $location);
})

.controller('SignupController', function(usersService, $scope, $location) {
    redirects($scope, $location);

    $scope.createAccount = function() {
        var promise = usersService.addUser(
            $scope.signup.username,
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

.controller('LoginController', function($scope, $location) {
    redirects($scope, $location);
})

.controller('EimadFormController', function($scope) {

});

var redirects = function($scope, $location) {
    $scope.redirectToSignup = function() {
        $location.path('/signup');
    };

    $scope.redirectToLogin = function() {
        $location.path('/login');
    };
};
