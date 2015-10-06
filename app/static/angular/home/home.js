angular.module('app.home', [])

.config(function($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'angular/home/home.html',
        controller: 'HomeController'
    });
})
.controller('HomeController', function($scope, store, $state) {
    store.remove('jwt');
});
