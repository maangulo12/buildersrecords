angular.module('app.home', [])

.config(function($stateProvider) {
    $stateProvider.state('home', {
        url:         '/',
        templateUrl: 'angular/home/home.html',
        controller:  'HomeController'
    });
})
.controller('HomeController', function(store) {
    init();

    function init() {
        store.remove('jwt');
    }
});
