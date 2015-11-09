angular.module('app.projects', [])

.config(function($stateProvider) {
    $stateProvider.state('projects', {
        url:         '/projects',
        templateUrl: 'angular/projects/projects.html',
        controller:  'ProjectsController',
        data:        {
            requiresLogin: true
        }
    });
})
.controller('ProjectsController', function($scope, store, ProjectService, UploadService) {
    init();

    function init() {
        $scope.username = store.get('user').username;
        getProjects();
    }
    $scope.clickedProject = function(project) {
        var index = $scope.project_list.indexOf(project);
        if (index !== -1) {
            store.set('project', project);
            return true;
        }
        return false;
    }
    // GET function
    function getProjects() {
        ProjectService.getProjects()
        .then(function(response) {
            $scope.project_list = response.data.objects;
        }, function(error) {
            $scope.error_msg_get = true;
        });
    }
    // ADD functions
    $scope.showNewProjectModal = function() {
        $scope.project = {};
        $scope.new_project_form.$setPristine();
        $('#new_project_modal').modal('show');
    }
    $scope.createProject = function() {
        if ($('#project_file').length) {
            var file = $('#project_file')[0].files[0];

            var form = new FormData();
            form.append('file', file);
            form.append('name', $scope.project.name);
            form.append('address', $scope.project.address);
            form.append('city', $scope.project.city);
            form.append('state', $scope.project.state);
            form.append('zipcode', $scope.project.zipcode);
            form.append('home_sq', $scope.project.home_sq);
            form.append('project_type', $scope.project.type);
            form.append('username', store.get('user').username);

            UploadService.uploadUbuildit(form)
            .then(function(response) {
                $('#new_project_modal').modal('hide');
                addProject();
            }, function(error) {
                $scope.new_project_form.$invalid = true;
            });
        } else {
            addProject();
        }
    }
    function addProject() {
        ProjectService.addProject($scope.project)
        .then(function(response) {
            $('#new_project_modal').modal('hide');
            getProjects();
        }, function(error) {
            $scope.new_project_form.$invalid = true;
        });
    }
    // DELETE functions
    $scope.showDeleteProjectModal = function() {
        $scope.error_msg_delete = false;
        $('#delete_project_modal').modal('show');
    }
    $scope.deleteProject = function() {
        ProjectService.deleteProject()
        .then(function(response) {
            $('#delete_project_modal').modal('hide');
            getProjects();
        }, function(error) {
            $scope.error_msg_delete = true;
        });
    }
    // UPDATE functions
    $scope.showEditProjectModal = function(project) {
        $scope.updated_project = store.get('project');
        $scope.edit_project_form.$setPristine();
        $('#edit_project_modal').modal('show');
    }
    $scope.updateProject = function() {
        ProjectService.updateProject($scope.updated_project)
        .then(function(response) {
            $('#edit_project_modal').modal('hide');
            getProjects();
        }, function(error) {
            $scope.edit_project_form.$invalid = true;
        });
    }
});
