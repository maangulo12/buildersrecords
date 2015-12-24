var app = angular.module('app.account', []);

app.config(function($stateProvider) {
    $stateProvider.state('account', {
        url: '/account',
        resolve: {
            User: function(UserService, store) {
                return UserService.getUser(store.get('user').id)
                .then(function(response) {
                    return response.data;
                }, function(error) {
                    return 'username';
                });
            }
        },
        views: {
            'nav': {
                templateUrl: 'static/angular/components/navs/nav2.html',
                controller: function($scope, User) {
                    $scope.username = User.username;
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

app.controller('AccountController', function($scope, User, UserService) {
    init();

    function init() {
        $scope.user          = {};
        $scope.user.email    = User.email;
        $scope.user.username = User.username;
    }

    $scope.updateEmail = function() {
        $scope.update_email_success = false;
        $scope.update_email_error = false;
        var btn = $('#update_email_btn').button('loading');
        UserService.updateEmail($scope.user.email)
        .then(function(response) {
            $scope.update_email_success = true;
            btn.button('reset');
        }, function(error) {
            $scope.email_form.$invalid = true;
            $scope.update_email_error = true;
            btn.button('reset');
        });
    }

    $scope.updateUsername = function() {
        $scope.update_username_success = false;
        $scope.update_username_error = false;
        var btn = $('#update_username_btn').button('loading');
        UserService.updateUsername($scope.user.username)
        .then(function(response) {
            $scope.update_username_success = true;
            btn.button('reset');
        }, function(error) {
            $scope.username_form.$invalid = true;
            $scope.update_username_error = true;
            btn.button('reset');
        });
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

    $scope.closeAccount = function() {
        // Close the account with stripe
        // Set active_until the day it was closed
    }
});
