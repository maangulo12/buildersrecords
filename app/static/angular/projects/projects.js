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
    // Turn on tooltip for Bootstrap
    $('[data-toggle="tooltip"]').tooltip();

    $scope.username = store.get('username');
    getProjects();

    // Get all of the user's projects
    function getProjects() {
        $http.get('/api/projects?q={"filters":[{"name":"user_id","op":"equals","val":"' + store.get('user_id') + '"}]}')
        .then(function(response) {
            $scope.projects = response.data.objects;
        });
    }
    $scope.logOut = function() {
        store.remove('jwt');
        $state.go('login');
    }
    $scope.clearFields = function() {
        $scope.project_name = '';
        $scope.new_project_form.$setPristine();
    }
    $scope.createProject = function() {
        $http.post('/api/projects', {
            project_name: $scope.project_name,
            user_id: store.get('user_id')
        })
        .then(function(response) {
            $("#close_button").click();
            getProjects();
            //$state.go('dashboard');
        }, function(response) {
            $scope.new_project_form.$invalid = true;
            $scope.new_project_form.project_name.$invalid = true;
        });
    }
});
