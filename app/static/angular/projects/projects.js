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
.controller('ProjectsController', function(Restangular, $scope, store, $state) {
    $scope.signed_user = store.get('signed_user');

    // Getting all projects using Restangular
    // Currently not working properly. Working on it.
    Restangular.all('api/projects').get(1).then(function(project) {
        console.log(project);
        $scope.project = project;
    });

    $scope.logOut = function() {
        store.remove('jwt');
        $state.go('login');
    }
});
