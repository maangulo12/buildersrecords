var app = angular.module('app.account', []);

app.config(function($stateProvider) {
    $stateProvider.state('account', {
        url: '/account',
        resolve: {
            UserObj: function(User, $q) {
                return User.retrieve().then(responseHandler, errorHandler);
                function responseHandler(response) {
                    return response.data;
                }
                function errorHandler(response) {
                    return $q.reject(response.data);
                }
            }
        },
        views: {
            'nav': {
                templateUrl: 'static/angular/components/navs/nav2.html',
                controller: function($scope, UserObj) {
                    $scope.username = UserObj.username;
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

app.controller('AccountController', function($scope, User, UserObj) {
    init();

    function init() {
        $scope.account          = {};
        $scope.account.email    = UserObj.email;
        $scope.account.username = UserObj.username;
    }

    $scope.updateAccount = function() {
        // Change email has to change stripe
        var btn = $('#update_account_button').button('loading');
        User.update($scope.account).then(responseHandler, errorHandler);
        function responseHandler(response) {
            $scope.update_account_success = true;
            btn.button('reset');
        }
        function errorHandler(response) {
            $scope.account_form.$invalid = true;
            $scope.update_account_error = true;
            btn.button('reset');
        }
    }

    // Needs work
    $scope.updatePassword = function() {
        // Check if current password matches
        // Hash new password in the backend
        var btn = $('#update-password-btn').button('loading');
        User.updatePassword($scope.user.new_password).then(responseHandler, errorHandler);
        function responseHandler(response) {
            // $scope.update_password_success = true;
            btn.button('reset');
        }
        function errorHandler(response) {
            $scope.password_form.$invalid = true;
            // $scope.update_password_error = true;
            btn.button('reset');
        }
    }
});
