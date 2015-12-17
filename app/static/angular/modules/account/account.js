var app = angular.module('app.account', []);

app.config(function($stateProvider) {
    $stateProvider.state('account', {
        url: '/account',
        views: {
            'nav': {
                templateUrl: 'static/angular/components/navs/nav2.html',
                controller: function($scope, store) {
                    $scope.username = store.get('user').username;
                }
            },
            'body': {
                templateUrl: 'static/angular/modules/account/account.html',
                controller: 'AccountController'
            }
        },
        data: {
            requiresLogin: true
        }
    });
});

app.controller('AccountController', function($scope, store, UserService) {
    init();

    function init() {
        UserService.getUserById().then(function(response) {
            $scope.user              = {};
            $scope.user.date_created = response.data.date_created;
            $scope.user.email        = response.data.email;
            $scope.user.username     = store.get('user').username;
        }, function(error) {
            $scope.error_msg = true;
        });
    }
});
