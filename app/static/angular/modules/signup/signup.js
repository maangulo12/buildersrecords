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

app.controller('SignupController', function($scope, store, $state, SubscriptionService, MailService, AuthService) {
    init();

    function init() {
        store.remove('jwt');
        $scope.signup = { sub_plan: 'monthly' };
    }

    $scope.signUp = function() {
        var btn = $('#sign-up-btn').button('loading');

        // Remember to change to live key
        Stripe.setPublishableKey('pk_test_KY3H8e295UxwoHrrqHBobKRC');

        //var valid_card = Stripe.card.validateCardNumber($scope.signup.card_number);
        //var valid_exp  = Stripe.card.validateExpiry($scope.signup.exp_month, $scope.signup.exp_year);
        //var valid_cvc  = Stripe.card.validateExpiry($scope.signup.cvc);

        Stripe.card.createToken({
            number:    $scope.signup.card_number,
            cvc:       $scope.signup.cvc,
            exp_month: $scope.signup.exp_month,
            exp_year:  $scope.signup.exp_year,
            name:      $scope.signup.card_name
        }, stripeResponseHandler);

        function stripeResponseHandler(status, response) {
            if (response.error) {
                error();
            } else {
                SubscriptionService.addSubscription($scope.signup, response.id)
                .then(function(response) {
                    MailService.sendRegistrationEmail($scope.signup);
                    AuthService.authenticate($scope.signup.username, $scope.signup.password)
                    .then(function(response) {
                        AuthService.storeToken(response);
                        $state.go('projects');
                    }, function(error) {
                        $state.go('login');
                    });
                }, function(error) {
                    error();
                });
            }
        }
        function error() {
            $scope.signup_form.$invalid = true;
            btn.button('reset');
        }
    }
});
