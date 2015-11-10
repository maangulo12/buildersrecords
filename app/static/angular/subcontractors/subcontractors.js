var app = angular.module('app.subcontractors', []);

app.config(function($stateProvider) {
    $stateProvider.state('subcontractors', {
        url:         '/subcontractors',
        templateUrl: 'angular/subcontractors/subcontractors.html',
        controller:  'SubcontractorController',
        data:        {
            requiresLogin: true
        }
    });
});

app.controller('SubcontractorController', function($scope, store, SubcontractorService) {
    init();

    function init() {
        $scope.username = store.get('user').username;
        getSubcontractors();
    }
    function getSubcontractors() {
        SubcontractorService.getSubcontractors().then(function(response) {
            $scope.subcontractor_list = response.data.objects;
        }, function(error) {
            $scope.error_msg_get = true;
        });
    }
});
