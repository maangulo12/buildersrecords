angular.module('app.login', [])

.config(function($stateProvider) {
    $stateProvider.state('login', {
        url:         '/login',
        templateUrl: 'angular/login/login.html',
        controller:  'LoginController'
    });
})
.controller('LoginController', function($scope, store, $state, AuthService) {
    init();

    function init() {
        store.remove('jwt');
    }
    $scope.logIn = function() {
        // Authenticate User
        AuthService.authenticate($scope.login.user, $scope.login.password)
        .then(function(response) {
            // Store Token
            AuthService.storeToken(response);
            $state.go('projects');
        }, function(error) {
            $scope.login_form.$invalid = true;
            $scope.login.password = '';
        });
    }
});
