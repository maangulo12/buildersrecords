(function() {
    'use strict';

    angular
        .module('app.login')
        .config(route);

    function route($stateProvider) {
        $stateProvider.state('login', {
            url: '/login',
            views: {
                'nav': {
                    templateUrl: 'static/angular/partials/navs/nav1.html'
                },
                'body': {
                    templateUrl:  'static/angular/modules/login/login.html',
                    controller:   'LoginController',
                    controllerAs: 'vm'
                }
            }
        });
    }
})();
