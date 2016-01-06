(function() {
    'use strict';

    angular
        .module('app')
        .run(run);

    run.$inject = ['$rootScope', '$state', 'store', 'jwtHelper'];

    function run($rootScope, $state, store, jwtHelper) {
        $rootScope.$on('$stateChangeStart', change);
    }

    // Restricts access to routes that require login
    // Checks if the token is expired
    function change(e, to) {
        if (to.data && to.data.requiresLogin) {
            if (!store.get('jwt') || jwtHelper.isTokenExpired(store.get('jwt'))) {
                e.preventDefault();
                $state.go('login');
            }
        }
    }
})();
