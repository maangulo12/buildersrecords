var controllers = angular.module('controllers', ['services']);

controllers.controller('HomeController', function ($scope) {
    $scope.message = "I'm running Flask and AngularJS!";
});

controllers.controller('SignupController', function ($scope, UsersService) {
    $scope.value = UsersService.method2();
});

controllers.controller('EimadFormController', function ($scope) {

});
