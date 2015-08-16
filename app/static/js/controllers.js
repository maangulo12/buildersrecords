angular.module('app.controllers', ['app.services'])

.controller('HomeController', function($scope) {
    $scope.message = "I'm running Flask and AngularJS!";
})

.controller('SignupController', function(usersService, $scope) {
    var promise = usersService.getAllUsers();
    var success = function(response) {
        $scope.msg = response.data;
    };
    var failure = function(response) {
        $scope.msg = response.status;
    };
    promise.then(success, failure);

    $scope.createAccount = function() {
        var promise = usersService.addUser($scope.signup.username,
                                           $scope.signup.password,
                                           $scope.signup.first_name,
                                           $scope.signup.last_name,
                                           $scope.signup.email);
        var success = function(response) {
            $scope.status_sent = response.status;
        };
        var failure = function(response) {
            $scope.status_sent = response.status;
        };
        promise.then(success, failure);
    };
})

.controller('EimadFormController', function($scope) {

});
