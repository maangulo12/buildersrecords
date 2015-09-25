angular.module('app.login', [])

.config(function($stateProvider) {
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'angular/login/login.html',
        controller: 'LoginController'
    });
})
.controller('LoginController', function($scope, store, $state, $http, authService) {
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
    $scope.logIn = function() {
        // Authenticate user
        $http.post('/auth', {
            username: $scope.login,
            password: $scope.password
        }).then(function(response) {
            authService.authHelper(response);
            $state.go('projects');
        }, function(error) {
            $scope.login_form.$invalid = true;
            $scope.password = '';
        });
    }
});
