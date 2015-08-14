var controllers = angular.module('controllers', []);

controllers.controller('HomeController', function($scope) {
    $scope.message = "I'm running Flask and AngularJS!";
});

controllers.controller('SignupController', function($scope, $http) {
    $http.get('/api/users')
        .then(function(response) {
            $scope.msg = response.data;

        }, function(response) {
            $scope.msg = response.status;
        }
    );

    $scope.addUser = function() {
        $http.post('/api/users', {
            username: $scope.signup.username,
            pw_hash: $scope.signup.password,
            first_name: $scope.signup.first_name,
            last_name: $scope.signup.last_name,
            email: $scope.signup.email

        }).then(function(response) {
            $scope.status_sent = response.status;

        }, function(response) {
            $scope.status_sent = response.status;
        });
    }
});

controllers.controller('EimadFormController', function($scope) {

});
