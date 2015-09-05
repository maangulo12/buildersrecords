angular.module('app.controllers', [
    'app.services'
])

.controller('HomeController', function($scope, $location) {
    redirects($scope, $location);
})

.controller('SignupController', function(usersService, $scope, $location) {
    redirects($scope, $location);

    $scope.createAccount = function() {
        var promise = usersService.addUser(
            $scope.signup.username,
            $scope.signup.password,
            $scope.signup.first_name,
            $scope.signup.last_name,
            $scope.signup.email);
        var success = function(response) {
            if (response.status == 201) {
                $location.path('/login');
            } else {
                $scope.signup_form.$invalid = true;
            }
        };
        var failure = function(error) {
            $scope.signup_form.$invalid = true;
        };
        promise.then(success, failure);
    };
})

.controller('LoginController', function(authService, store, $scope, $location) {
    redirects($scope, $location);

    $scope.logIn = function() {
        var promise = authService.authenticate($scope.login, $scope.password);
        var success = function(response) {
            if (response.status == 200) {
                store.set('jwt', response.data.token);
                $location.path('/projects');
            } else {
                $scope.login_form.$invalid = true;
            }
        };
        var failure = function(error) {
            $scope.login_form.$invalid = true;
            store.remove('jwt');
        };
        promise.then(success, failure);
    };
})

.controller('ProjectsController', function($scope) {

})

.controller('EimadFormController', function($scope) {

});

var redirects = function($scope, $location) {
    $scope.redirectToSignup = function() {
        $location.path('/signup');
    };

    $scope.redirectToLogin = function() {
        $location.path('/login');
    };
};
