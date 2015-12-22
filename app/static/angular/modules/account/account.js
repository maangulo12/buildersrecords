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

app.controller('AccountController', function($scope, store, SubscriptionService, UserService) {
    init();

    function init() {
        $scope.user = {};
        $scope.user.date_created = store.get('user').date_created;
        $scope.user.email        = store.get('user').email;
        $scope.user.username     = store.get('user').username;

        SubscriptionService.getSubscription()
        .then(function(response) {
            $scope.user.card       = {};
            $scope.user.card.name  = response.data.sources.data[0].name;
            $scope.user.card.last4 = response.data.sources.data[0].last4;
            $scope.user.card.brand = response.data.sources.data[0].brand;
            $scope.user.sub_plan   = response.data.subscriptions.data[0].plan.id;
        }, function(error) {
            $scope.error_msg = true;
        });
    }

    // Changing email should update Stripe

    $scope.showUpdateCardModal = function() {
        var btn = $('#create-project-btn').button('reset');
        // $scope.project = {};
        // $scope.new_project_form.$setPristine();
        $('#update_card').modal('show');
    }

    $scope.updatePassword = function() {
        var btn = $('#update-password-btn').button('loading');
        UserService.updatePassword($scope.user.new_password)
        .then(function(response) {
            alert('Password updated');
            $scope.update_password_success = true;
            btn.button('reset');
        }, function(error) {
            alert('Password could not be updated');
            $scope.update_password_failure = true;
            $scope.password_form.$invalid = true;
            btn.button('reset');
        });
    }
});
