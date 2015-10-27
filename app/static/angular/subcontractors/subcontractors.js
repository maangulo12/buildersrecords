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
.controller('SubcontractorController', function($scope, store, $state, $http) {
    init();

    // Init function
    function init() {
        $scope.username = store.get('username');
        getSubcontractors();
    }
    // Logout function
    $scope.logOut = function() {
        store.remove('jwt');
        $state.go('login');
    }
    function getSubcontractors() {
        $http.get('/api/subcontractors?q={"filters":[{"name":"project_id","op":"equals","val":"' + store.get('project').id + '"}]}')
        .then(function(response) {
            $scope.subcontractor_list = response.data.objects;
        }, function(error) {
            $scope.error_msg = 'Could not load your subcontractor list. Please try to refresh the page.';
        });
    }
});
