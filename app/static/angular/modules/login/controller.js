(function() {
    'use strict';

    angular
        .module('app.login', [])
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$scope', 'store', '$state', 'Auth', 'Utility'];

    function LoginController($scope, store, $state, Auth, Utility) {
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
