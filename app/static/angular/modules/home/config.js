(function() {
    'use strict';

    angular
        .module('app.home')
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                views: {
                    'nav': {
                        templateUrl: 'static/angular/components/navs/nav1.html'
                    },
                    'body': {
                        templateUrl: 'static/angular/modules/home/home.html',
                        controller: 'HomeController'
                    }
                }
            });
    }
})();
