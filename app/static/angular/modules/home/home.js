var app = angular.module('app.home', []);

app.config(function($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        views: {
            'nav': {
                templateUrl: 'static/angular/components/navs/nav1.html'
            },
            'body': {
                templateUrl: 'static/angular/modules/home/home.html',
                controller: function(store) {
                    store.remove('jwt');
                }
            }
        }
    });
});
