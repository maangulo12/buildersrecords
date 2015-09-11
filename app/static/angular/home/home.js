angular.module('app.home', [

])
.config(function($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'angular/home/home.html',
        controller: 'HomeController'
    })
})
.controller('HomeController', function($scope, $state) {
    // This function redirects to signup page
    $scope.redirectToSignup = function() {
        $state.go('signup');
    }
    // This function redirects to login page
    $scope.redirectToLogin = function() {
        $state.go('login');
    }
});
