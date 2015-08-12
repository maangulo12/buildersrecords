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

    // Post request: It Works!!!
    $scope.addUser = function() {
        $http.post('/api/users', {
            username: 'mangulo',
            pw_hash: 'password',
            first_name: 'Miguel',
            last_name: 'Angulo',
            email: 'my_email@gmail.com'

        }).then(function(response) {
            $scope.status_sent = response.status;

        }, function(response) {
            $scope.status_sent = response.status;
        });
    }
});

controllers.controller('EimadFormController', function($scope) {

});
