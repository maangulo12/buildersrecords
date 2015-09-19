angular.module('app.projects', [

])
.config(function($stateProvider) {
    // This state requires login (note the data field)
    $stateProvider.state('projects', {
        url: '/projects',
        templateUrl: 'angular/projects/projects.html',
        controller: 'ProjectsController',
        data: {
            requiresLogin: true
        }
    })
})
.controller('ProjectsController', function($http, $scope, store, $state) {
    $scope.username = store.get('username');

    $scope.logOut = function() {
        store.remove('jwt');
        $state.go('login');
    }
    $scope.clearFields = function() {
        $scope.project_name = "";
        $scope.new_project_form.$setPristine();
    }
    $scope.createProject = function() {
        $http.post('/api/projects', {
            project_name: $scope.project_name,
            project_type: $scope.project_type,
            user_id: store.get('user_id')
        });
    }
});
