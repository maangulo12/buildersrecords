var app = angular.module('app.login', []);

app.config(function($stateProvider) {
    $stateProvider.state('login', {
        url: '/login',
        views: {
            'nav': {
                templateUrl: 'static/angular/components/navs/nav1.html'
            },
            'body': {
                templateUrl: 'static/angular/modules/login/login.html',
                controller: 'LoginController'
            }
        }
    });
});

app.controller('LoginController', function($scope, store, $state, AuthService) {
    store.remove('jwt');

    $scope.logIn = function() {
        var btn = $('#log-in-btn').button('loading');
        AuthService.authenticate($scope.login.user, $scope.login.password)
        .then(function(response) {
            AuthService.storeToken(response);
            $state.go('projects');
        }, function(error) {
            $scope.login_form.$invalid = true;
            $scope.login_form.$submitted = true;
            $scope.login.password = '';
            btn.button('reset');
        });
    }
});