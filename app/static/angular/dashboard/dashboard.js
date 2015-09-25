angular.module('app.dashboard', [])

.config(function($stateProvider) {
    $stateProvider.state('dashboard', {
        url: '/dashboard',
        templateUrl: 'angular/dashboard/dashboard.html',
        controller: 'DashboardController'
    });
})
.controller('DashboardController', function($scope, store, $state) {
    init();

    function init() {
        $scope.username = store.get('username');
        $scope.project_name = store.get('project_name');
    }
    $scope.logOut = function() {
        store.remove('jwt');
        $state.go('login');
    }
});
