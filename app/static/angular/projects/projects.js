angular.module('app.projects', [])

.config(function($stateProvider) {
    $stateProvider.state('projects', {
        url: '/projects',
        templateUrl: 'angular/projects/projects.html',
        controller: 'ProjectsController',
        data: {
            requiresLogin: true
        }
    });
})
.controller('ProjectsController', function($scope, store, $state, $http) {
    init();

    function init() {
        $scope.username = store.get('username');
        getProjects();
    }
    $scope.logOut = function() {
        store.remove('jwt');
        $state.go('login');
    }
    $scope.clickedProject = function(project) {
        var index = $scope.project_list.indexOf(project);
        if (index !== -1) {
            store.set('project', project);
            return true;
        }
        return false;
    }
    $scope.redirectToDashboard = function() {
        $state.go('dashboard');
    }
    // GET function
    function getProjects() {
        $http.get('/api/projects?q={"filters":[{"name":"user_id","op":"equals","val":"' + store.get('user_id') + '"}]}')
        .then(function(response) {
            $scope.project_list = response.data.objects;
        }, function(error) {
            $scope.error_msg = 'Could not get your projects. Please try to refresh your page.';
        });
    }
    // ADD functions
    $scope.showNewProjectModal = function() {
        $scope.project = {};
        $scope.new_project_form.$setPristine();
        $('#new_project_modal').modal('show');
    }
    $scope.createProject = function() {
        $http.post('/api/projects', {
            name: $scope.project.name,
            user_id: store.get('user_id')
        })
        .then(function(response) {
            $('#new_project_modal').modal('hide');
            getProjects();
        }, function(error) {
            $scope.new_project_form.$invalid = true;
            $scope.new_project_form.name.$invalid = true;
        });
    }
    // DELETE functions
    $scope.showDeleteProjectModal = function() {
        $('#delete_project_modal').find('.modal-title').text('Delete Project: ' + store.get('project').name);
        $('#delete_project_modal').find('.modal-title').addClass('text-danger');
        $('#delete_project_modal').find('.modal-title').css('font-weight', 'Bold');
        $scope.error_msg_delete = false;
        $('#delete_project_modal').modal('show');
    }
    $scope.deleteProject = function() {
        $http.delete('/api/projects/' + store.get('project').id)
        .then(function(response) {
            $('#delete_project_modal').modal('hide');
            getProjects();
        }, function(error) {
            $scope.error_msg_delete = 'Could not delete your project.';
        });
    }
    // UPDATE functions
    $scope.showEditProjectModal = function(project) {
        $scope.updated_project = {};
        $scope.updated_project.name = store.get('project').name;
        $scope.edit_project_form.$setPristine();
        $('#edit_project_modal').find('.modal-title').text('Edit Project: ' + store.get('project').name);
        $('#edit_project_modal').find('.modal-title').css('font-weight', 'Bold');
        $('#edit_project_modal').modal('show');
    }
    $scope.updateProject = function() {
        $http.put('/api/projects/' + store.get('project').id, {
            name: $scope.updated_project.name,
            user_id: store.get('user_id')
        })
        .then(function(response) {
            $('#edit_project_modal').modal('hide');
            getProjects();
        }, function(error) {
            $scope.edit_project_form.$invalid = true;
            $scope.edit_project_form.name.$invalid = true;
        });
    }
});
