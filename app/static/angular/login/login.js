angular.module('app.login', [

])
.config(function($stateProvider) {
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'angular/login/login.html',
        controller: 'LoginController'
    })
})
.controller('LoginController', function($http, $scope, store, $state) {
    // Remove jwt since we in login page
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
            // Add token to jwt variable
            store.set('jwt', response.data.token);
            store.set('signed_user', $scope.login);
            // store.set('signed_user_id', $scope.login);
            console.log('User Authenticated.');
            $state.go('projects');
        }, function(error) {
            // Error occurred
            $scope.login_form.$invalid = true;
            $scope.password = '';
        });
    }
});
