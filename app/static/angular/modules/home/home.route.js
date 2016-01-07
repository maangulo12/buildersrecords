(function() {
    'use strict';

    angular
        .module('app.home')
        .config(route);

    function route($stateProvider) {
        $stateProvider.state('home', {
            url: '/',
            views: {
                'nav': {
                    templateUrl: 'static/angular/partials/navs/nav1.html'
                },
                'body': {
                    templateUrl:  'static/angular/modules/home/home.html',
                    controller:   'HomeController',
                    controllerAs: 'vm'
                }
            }
        });
    }
})();
