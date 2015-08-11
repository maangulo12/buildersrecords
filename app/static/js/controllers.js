var controllers = angular.module('controllers', ['services']);

controllers.controller('HomeController', function($scope) {
    $scope.message = "I'm running Flask and AngularJS!";
});

controllers.controller('SignupController', function($scope, UsersService) {
    $scope.users = UsersService.getUsersList();
});

controllers.controller('EimadFormController', function($scope) {

});
