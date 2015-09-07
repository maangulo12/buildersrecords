angular.module('app.login', [
    'ui.router',
    'angular-storage',
    'app.services'
])
.config(function($stateProvider) {
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'angular/login/login.html',
        controller: 'LoginController'
    })
})
.controller('LoginController', function(authService, $scope, store, $state) {
    store.remove('jwt');

    $scope.redirectToSignup = function() {
        $state.go('signup');
    }
    $scope.redirectToLogin = function() {
        $state.go('login');
    }
    $scope.logIn = function() {
        var promise = authService.authenticate($scope.login, $scope.password);
        var success = function(response) {
            if (response.status == 200) {
                store.set('jwt', response.data.token);
                store.set('signed_user', $scope.login);
                $state.go('projects');
            } else {
                $scope.login_form.$invalid = true;
                store.remove('jwt');
            }
        }
        var failure = function(error) {
            $scope.login_form.$invalid = true;
            store.remove('jwt');
        }
        promise.then(success, failure);
    }
});
