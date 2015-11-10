var app = angular.module('app.login', []);

app.config(function($stateProvider) {
    $stateProvider.state('login', {
        url:         '/login',
        templateUrl: 'angular/login/login.html',
        controller:  'LoginController'
    });
});

app.controller('LoginController', function($scope, store, $state, AuthService) {
    init();

    function init() {
        store.remove('jwt');
    }
    $scope.logIn = function() {
        AuthService.authenticate($scope.login.user, $scope.login.password)
        .then(function(response) {
            AuthService.storeToken(response);
            $state.go('projects');
        }, function(error) {
            $scope.login_form.$invalid = true;
            $scope.login.password = '';
        });
    }
});
