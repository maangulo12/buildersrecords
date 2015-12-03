var app = angular.module('app.signup.single', []);

app.config(function($stateProvider) {
    $stateProvider.state('single', {
        url: '/signup/single',
        views: {
            'nav': {
                templateUrl: 'static/angular/components/navs/nav1.html'
            },
            'body': {
                templateUrl: 'static/angular/modules/signup/single/single.html',
                controller: 'SingleController'
            }
        }
    });
});

app.controller('SingleController', function($scope, store, $state, UserService, MailService, AuthService) {
    store.remove('jwt');

    $scope.createAccount = function() {
        var btn = $('#create-account-btn').button('loading');
        UserService.addUser($scope.signup).then(function(response) {
            MailService.sendRegistrationEmail($scope.signup);
            AuthService.authenticate($scope.signup.username, $scope.signup.password)
            .then(function(response) {
                AuthService.storeToken(response);
                $state.go('projects');
            }, function(error) {
                $state.go('login');
            });
        }, function(error) {
            $scope.signup_form.$invalid = true;
            btn.button('reset');
        });
    }
});
