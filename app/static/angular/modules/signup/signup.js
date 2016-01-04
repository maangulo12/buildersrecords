var app = angular.module('app.signup', []);

app.config(function($stateProvider) {
    $stateProvider.state('signup', {
        url: '/signup',
        views: {
            'nav': {
                templateUrl: 'static/angular/components/navs/nav1.html'
            },
            'body': {
                templateUrl: 'static/angular/modules/signup/signup.html',
                controller: 'SignupController'
            }
        }
    });
});

app.controller('SignupController', function($scope, store, $state, Subscription, Mail, Auth, Utility) {
    init();

    function init() {
        store.remove('jwt');
        $scope.signup = {
            plan: 'monthly'
        };
    }

    $scope.signUp = function() {
        var btn = $('#signup_button').button('loading');
        var val_card = Stripe.card.validateCardNumber($scope.signup.card_number);
        var val_exp  = Stripe.card.validateExpiry($scope.signup.exp_month, $scope.signup.exp_year);
        var val_cvc  = Stripe.card.validateCVC($scope.signup.cvc);

        if (val_card && val_exp && val_cvc) {
            var data = {
                number:    $scope.signup.card_number,
                cvc:       $scope.signup.cvc,
                exp_month: $scope.signup.exp_month,
                exp_year:  $scope.signup.exp_year,
                name:      $scope.signup.card_name.toUpperCase()
            };
            // Remember to change this to live key
            Stripe.setPublishableKey('pk_test_KY3H8e295UxwoHrrqHBobKRC');
            Stripe.card.createToken(data, stripeResponseHandler);
        } else {
            error();
        }
        function stripeResponseHandler(status, response) {
            if (response.error) {
                error();
            } else {
                Subscription.create($scope.signup, response.id).then(responseHandler1, errorHandler1);
            }
        }
        function responseHandler1(response) {
            Mail.sendRegistrationEmail($scope.signup);
            Auth.authenticate($scope.signup).then(responseHandle2, errorHandler2);
        }
        function errorHandler1(response) {
            error();
        }
        function responseHandle2(response) {
            Utility.storeToken(response);
            $state.go('tutorial');
        }
        function errorHandler2(response) {
            $state.go('login');
        }
        function error() {
            $scope.signup_form.$invalid = true;
            btn.button('reset');
        }
    }
});
