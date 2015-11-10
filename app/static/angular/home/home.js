var app = angular.module('app.home', []);

app.config(function($stateProvider) {
    $stateProvider.state('home', {
        url:         '/',
        templateUrl: 'angular/home/home.html',
        controller:  'HomeController'
    });
});

app.controller('HomeController', function(store) {
    init();

    function init() {
        store.remove('jwt');
    }
});
