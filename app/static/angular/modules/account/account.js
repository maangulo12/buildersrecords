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

app.controller('AccountController', function($scope, store, SubscriptionService) {
    init();

    function init() {
        $scope.user = {};
        $scope.user.date_created = store.get('user').date_created;
        $scope.user.email        = store.get('user').email;
        $scope.user.username     = store.get('user').username;

        SubscriptionService.getSubscription().then(function(response) {
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

    $scope.updatePassword = function() {
        var btn = $('#update-password-btn').button('loading');

        // Needs work     
    }
});
