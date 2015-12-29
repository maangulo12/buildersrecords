var app = angular.module('app.projects', []);

app.config(function($stateProvider) {
    $stateProvider.state('projects', {
        url: '/projects',
        resolve: {
            UserObj: function(User, $q) {
                return User.retrieve().then(responseHandler, errorHandler);
                function responseHandler(response) {
                    return response.data;
                }
                function errorHandler(response) {
                    return $q.reject(response.data);
                }
            }
        },
        views: {
            'nav': {
                templateUrl: 'static/angular/components/navs/nav2.html',
                controller: function($scope, UserObj) {
                    $scope.username = UserObj.username;
                }
            },
            'body': {
                templateUrl: 'static/angular/modules/projects/projects.html',
                controller: 'ProjectsController'
            }
        },
        data: {
            requiresLogin: true
        }
    });
});

app.controller('ProjectsController', function($scope, store, ProjectService, UploadService) {
    getProjects();

    function getProjects() {
        ProjectService.getProjects().then(function(response) {
            $scope.project_list = response.data.objects;
        }, function(error) {
            $scope.error_msg_get = true;
        });
    }

    $scope.clickedProject = function(project) {
        var index = $scope.project_list.indexOf(project);
        if (index !== -1) {
            store.set('project', project);
            return true;
        }
        return false;
    }    

    // ADD PROJECT functions
    $scope.showNewProjectModal = function() {
        var btn = $('#create-project-btn').button('reset');
        $scope.project = {};
        $scope.new_project_form.$setPristine();
        $('#new_project_modal').modal('show');
    }
    $scope.createProject = function() {
        var btn = $('#create-project-btn').button('loading');

        if ($('#project_file').length && $('#project_file')[0].files[0]) {
            var form = new FormData();
            form.append('file', $('#project_file')[0].files[0]);
            form.append('name', $scope.project.name);
            form.append('address', $scope.project.address);
            form.append('city', $scope.project.city);
            form.append('state', $scope.project.state);
            form.append('zipcode', $scope.project.zipcode);
            form.append('home_sq', $scope.project.home_sq);
            form.append('project_type', $scope.project.type);
            form.append('user_id', store.get('user').id);

            UploadService.uploadUbuildit(form).then(function(response) {
                $('#new_project_modal').modal('hide');
                getProjects();
            }, function(error) {
                $scope.new_project_form.$invalid = true;
                btn.button('reset');
            });
        } else {
            ProjectService.addProject($scope.project).then(function(response) {
                $('#new_project_modal').modal('hide');
                getProjects();
            }, function(error) {
                $scope.new_project_form.$invalid = true;
                btn.button('reset');
            });
        }
    }

    // DELETE PROJECT functions
    $scope.showDeleteProjectModal = function() {
        $scope.error_msg_delete = false;
        $('#delete_project_modal').modal('show');
    }
    $scope.deleteProject = function() {
        var btn = $('#delete-project-btn').button('loading');
        ProjectService.deleteProject().then(function(response) {
            $('#delete_project_modal').modal('hide');
            getProjects();
        }, function(error) {
            $scope.error_msg_delete = true;
            btn.button('reset');
        });
    }

    // UPDATE PROJECT functions
    $scope.showEditProjectModal = function(project) {
        $scope.updated_project         = {};
        $scope.updated_project.name    = store.get('project').name;
        $scope.updated_project.address = store.get('project').address;
        $scope.updated_project.city    = store.get('project').city;
        $scope.updated_project.state   = store.get('project').state;
        $scope.updated_project.zipcode = store.get('project').zipcode;
        $scope.updated_project.home_sq = store.get('project').home_sq;
        $scope.edit_project_form.$setPristine();
        $('#edit_project_modal').modal('show');
    }
    $scope.updateProject = function() {
        var btn = $('#update-project-btn').button('loading');
        ProjectService.updateProject($scope.updated_project).then(function(response) {
            $('#edit_project_modal').modal('hide');
            getProjects();
        }, function(error) {
            $scope.edit_project_form.$invalid = true;
            btn.button('reset');
        });
    }
});
