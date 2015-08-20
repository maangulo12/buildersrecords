angular.module('app.controllers', ['app.services'])

.controller('HomeController', function($scope) {
    $scope.message = "I'm running Flask and AngularJS!";
})

.controller('SignupController', function(usersService, $scope) {
    $scope.createAccount = function() {
        var promise = usersService.addUser($scope.signup.username,
                                           $scope.signup.password,
                                           $scope.signup.first_name,
                                           $scope.signup.last_name,
                                           $scope.signup.email);
        var success = function(response) {
            $scope.status_sent = response.status;

            // Need to redirect here to user home page
        };
        var failure = function(response) {
            $scope.status_sent = response.status;

            // Display alert here using ui.bootstrap extension
        };
        promise.then(success, failure);
    };
})

.controller('EimadFormController', function($scope) {

});
