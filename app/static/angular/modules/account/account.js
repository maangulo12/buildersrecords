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
        $scope.user          = {};
        $scope.user.email    = store.get('user').email;
        $scope.user.username = store.get('user').username;
    }

    $scope.updatePassword = function() {
        // Check if current password matches
        // Hash new password in the backend
        var btn = $('#update-password-btn').button('loading');
        UserService.updatePassword($scope.user.new_password)
        .then(function(response) {
            btn.button('reset');
        }, function(error) {
            $scope.password_form.$invalid = true;
            btn.button('reset');
        });
    }
});
