angular.module('app.login', [

])
.config(function($stateProvider) {
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'angular/login/login.html',
        controller: 'LoginController'
    })
})
.controller('LoginController', function($http, $scope, store, $state, authService) {
    store.remove('jwt');

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
            // Call authentication helper
            authService.authHelper(response);
            // Go to projects page
            $state.go('projects');
        }, function(error) {
            // Error occurred
            $scope.login_form.$invalid = true;
            $scope.password = '';
        });
    }
});
