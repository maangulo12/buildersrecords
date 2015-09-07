angular.module('app.signup', [

])
.config(function($stateProvider) {
    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'angular/signup/signup.html',
        controller: 'SignupController'
    })
})
.controller('SignupController', function(usersService, authService, $scope, store, $state) {
    store.remove('jwt');

    $scope.redirectToSignup = function() {
        $state.go('signup');
    }
    $scope.redirectToLogin = function() {
        $state.go('login');
    }
    $scope.createAccount = function() {
        var promise = usersService.addUser(
            $scope.signup.username,
            $scope.signup.password,
            $scope.signup.first_name,
            $scope.signup.last_name,
            $scope.signup.email);
        var success = function(response) {
            if (response.status == 201) {
                var promise2 = authService.authenticate($scope.signup.username, $scope.signup.password);
                var success2 = function(response) {
                    if (response.status == 200) {
                        store.set('jwt', response.data.token);
                        store.set('signed_user', $scope.signup.username);
                        $state.go('projects');
                    } else {
                        $scope.login_form.$invalid = true;
                        store.remove('jwt');
                    }
                }
                var failure2 = function(error) {
                    $scope.login_form.$invalid = true;
                    store.remove('jwt');
                }
                promise2.then(success2, failure2);
            } else {
                $scope.signup_form.$invalid = true;
                store.remove('jwt');
            }
        }
        var failure = function(error) {
            $scope.signup_form.$invalid = true;
        }
        promise.then(success, failure);
    };
});
