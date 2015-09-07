angular.module('app.projects', [
    
])
.config(function($stateProvider) {
    $stateProvider.state('projects', {
        url: '/projects',
        templateUrl: 'angular/projects/projects.html',
        controller: 'ProjectsController',
        data: {
            requiresLogin: true
        }
    })
})
.controller('ProjectsController', function($scope, store, $state) {
    $scope.signed_user = store.get('signed_user');
    $scope.logOut = function() {
        store.remove('jwt');
        $state.go('login');
    }
});
