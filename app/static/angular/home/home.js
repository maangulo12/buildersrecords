angular.module('app.home', [])

.config(function($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'angular/home/home.html',
        controller: 'HomeController'
    });
})
.controller('HomeController', function($scope, store, $state) {
    init();

    function init() {
        store.remove('jwt');
    }
    $scope.redirectToSignup = function() {
        $state.go('signup');
    }
    $scope.redirectToLogin = function() {
        $state.go('login');
    }
});
