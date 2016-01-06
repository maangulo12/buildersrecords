(function() {
    'use strict';

    angular
        .module('app.login')
        .config(config);

    function config($stateProvider) {
        $stateProvider.state('login', {
            url: '/login',
            views: {
                'nav': {
                    templateUrl: 'static/angular/components/navs/nav1.html'
                },
                'body': {
                    templateUrl: 'static/angular/modules/login/login.html',
                    controller: 'LoginController'
                }
            }
        });
    }
})();
