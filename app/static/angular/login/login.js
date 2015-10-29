angular.module('app.login', [])

.config(function($stateProvider) {
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'angular/login/login.html',
        controller: 'LoginController'
    });
})
.controller('LoginController', function($scope, store, $state, $http, authService) {
    store.remove('jwt');

    $scope.logIn = function() {
        // Authenticate user
        $http.post('/api/auth', {
            login: $scope.login.user,
            password: $scope.login.password
        }).then(function(response) {
            authService.authHelper(response);
            $state.go('projects');
        }, function(error) {
            $scope.login_form.$invalid = true;
            $scope.login.password = '';
        });
    }
});
