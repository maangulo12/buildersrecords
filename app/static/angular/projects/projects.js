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
    // Bootstrap tooltip init
    $('[data-toggle="tooltip"]').tooltip();

    // Signed in user
    $scope.username = store.get('username');
    // Load user's projects
    getProjects();

    // Log Out function
    $scope.logOut = function() {
        store.remove('jwt');
        $state.go('login');
    }
    // Clicked Project function
    $scope.clickedProject = function(project) {
        var index = $scope.project_list.indexOf(project);
        if (index !== -1) {
            store.set('project_id', project.id);
            store.set('project_name', project.project_name);
            return true;
        }
        return false;
    }
    // Redirect to Dashboard
    $scope.redirectToDashboard = function() {
        $state.go('dashboard');
    }
    // GET PROJECTS function
    function getProjects() {
        $http.get('/api/projects?q={"filters":[{"name":"project_id","op":"equals","val":"' + store.get('user_id') + '"}]}')
        .then(function(response) {
            $scope.project_list = response.data.objects;
        }, function(response) {
            // Could not load user's project
        });
    }
    // NEW PROJECT functions
    $scope.showNewProjectModal = function() {
        $scope.project_name = '';
        $scope.new_project_form.$setPristine();
        $('#new_project_modal').modal('show');
    }
    $scope.createProject = function() {
        $http.post('/api/projects', {
            project_name: $scope.project_name,
            user_id: store.get('user_id')
        })
        .then(function(response) {
            $('#new_project_modal').modal('hide');
            getProjects();
        }, function(response) {
            $scope.new_project_form.$invalid = true;
            $scope.new_project_form.project_name.$invalid = true;
        });
    }
    // DELETE PROJECT functions
    $scope.showDeleteProjectModal = function() {
        $('#delete_project_modal').find('.modal-title').text('Delete Project - ' + store.get('project_name'));
        $('#delete_project_modal').find('.modal-title').addClass('text-danger');
        $('#delete_project_modal').modal('show');
    }
    $scope.deleteProject = function() {
        $http.delete('/api/projects/' + store.get('project_id'))
        .then(function(response) {
            $('#delete_project_modal').modal('hide');
            getProjects();
        }, function(response) {
            // Could not delete project
        });
    }
    // UPDATE PROJECT (Edit) functions
    $scope.showEditProjectModal = function(project) {
        $scope.updated_project_name = store.get('project_name');
        $scope.edit_project_form.$setPristine();
        $('#edit_project_modal').find('.modal-title').text('Edit Project - ' + store.get('project_name'));
        $('#edit_project_modal').modal('show');
    }
    $scope.updateProject = function() {
        $http.put('/api/projects/' + store.get('project_id'), {
            project_name: $scope.updated_project_name,
            user_id: store.get('user_id')
        })
        .then(function(response) {
            $('#edit_project_modal').modal('hide');
            getProjects();
        }, function(response) {
            $scope.edit_project_form.$invalid = true;
            $scope.new_project_form.updated_project_name.$invalid = true;
        });
    }
});
