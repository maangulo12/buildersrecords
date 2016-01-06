(function() {
    'use strict';

    angular
        .module('app.login', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                views: {
                    'nav': {
                        templateUrl: 'static/angular/components/navs/nav1.html'
                    },
                    'body': {
                        templateUrl: 'static/angular/modules/login/login.html',
                        controller: Login
                    }
                }
            });
    }

    Login.$inject = ['$scope', 'store', '$state', 'Auth', 'Utility'];

    function Login($scope, store, $state, Auth, Utility) {
        store.remove('jwt');

        $scope.logIn = function() {
            var btn = $('#login_button').button('loading');
            Auth.authenticate($scope.login)
                .then(responseHandler)
                .catch(errorHandler);
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
    }
})();
