angular.module('app.subcontractors', [])

.config(function($stateProvider) {
    $stateProvider.state('subcontractors', {
        url: '/subcontractors',
        templateUrl: 'angular/subcontractors/subcontractors.html',
        controller: 'SubcontractorController',
        data: {
            requiresLogin: true
        }
    });
})
.controller('SubcontractorController', function($scope, store, $state) {
    init();

    // Init function
    function init() {
        $scope.username = store.get('username');
    }
    // Logout function
    $scope.logOut = function() {
        store.remove('jwt');
        $state.go('login');
    }
});
