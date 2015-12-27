var app = angular.module('app.account.billing', []);

app.config(function($stateProvider) {
    $stateProvider.state('billing', {
        url: '/account/billing',
        resolve: {
            User: function(UserService, store) {
                return UserService.getUser(store.get('user').id)
                .then(function(response) {
                    return response.data;
                }, function(error) {
                    return 'error';
                });
            },
            Subscription: function(SubscriptionService, store) {
                return SubscriptionService.getSubscription()
                .then(function(response) {
                    return response.data;
                }, function(error) {
                    return 'error';
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
                templateUrl: 'static/angular/modules/account/billing/billing.html',
                controller: 'BillingController'
            }
        },
        data: {
            requiresLogin: true
        }
    });
});

app.controller('BillingController', function($scope, Subscription) {
    init();

    function init() {
        $scope.user = {};
        $scope.user.card       = {};
        $scope.user.card.name  = Subscription.sources.data[0].name;
        $scope.user.card.last4 = Subscription.sources.data[0].last4;
        $scope.user.card.brand = Subscription.sources.data[0].brand;
        $scope.user.plan       = Subscription.subscriptions.data[0].plan.id;
    }

    $scope.showUpdateCardModal = function() {
        // $scope.project = {};
        // $scope.new_project_form.$setPristine();
        $('#update_card_modal').modal('show');
    }
});
