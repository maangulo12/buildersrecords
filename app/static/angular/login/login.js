angular.module('app.login', [

])
.config(function($stateProvider) {
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'angular/login/login.html',
        controller: 'LoginController'
    })
})
.controller('LoginController', function(authService, usersService, mailService, $scope, store, $state) {
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

                // Send Registration Email
                var promise2 = mailService.sendRegistrationEmail($scope.login);
                var success2 = function(response) {
                    if (response.status == 201) {
                        console.log('Registration email sent!');
                    } else {
                        console.log('Error: Registration email was not sent!');
                    }
                }
                var failure2 = function(error) {
                    console.log('Error: Registration email was not sent!');
                }
                promise2.then(success2, failure2);

                store.set('signed_user_id', $scope.login);
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
