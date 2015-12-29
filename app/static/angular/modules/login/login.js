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

app.controller('LoginController', function($scope, store, $state, Auth, Utility) {
    store.remove('jwt');

    $scope.logIn = function() {
        var btn = $('#login_button').button('loading');
        Auth.authenticate($scope.login).then(responseHandler, errorHandler);
        function responseHandler(response) {
            Utility.storeToken(response);
            $state.go('projects');
        }
        function errorHandler(response) {
            $scope.login_form.$invalid = true;
            $scope.login_form.$submitted = true;
            $scope.login.password = '';
            btn.button('reset');
        }
    }
});
