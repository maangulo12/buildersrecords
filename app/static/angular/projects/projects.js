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
        $scope.username = store.get('user').username;
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
    $scope.redirectToOverview = function() {
        $state.go('overview');
    }
    // GET function
    function getProjects() {
        $http.get('/api/projects?q={"filters":[{"name":"user_id","op":"equals","val":"' + store.get('user').id + '"}]}')
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
    $scope.changeFile = function() {
        console.log('File has been changed');
    }
    $scope.createProject = function() {
        if ($('#project_file').length) {
            var file = $('#project_file')[0].files[0];

            var fd = new FormData();
            fd.append('file', file);
            fd.append('name', $scope.project.name);
            fd.append('address', $scope.project.address);
            fd.append('city', $scope.project.city);
            fd.append('state', $scope.project.state);
            fd.append('zipcode', $scope.project.zipcode);
            fd.append('home_sq', $scope.project.home_sq);
            fd.append('project_type', $scope.project.type);
            fd.append('username', store.get('user').username);

            $http.post('/api/upload/ubuildit', fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            })
            .then(function(response) {
                $('#new_project_modal').modal('hide');
                getProjects();
            }, function(error) {
                $scope.new_project_form.$invalid = true;
            });
        } else {
            $http.post('/api/projects', {
                name:         $scope.project.name,
                address:      $scope.project.address,
                city:         $scope.project.city,
                state:        $scope.project.state,
                zipcode:      $scope.project.zipcode,
                home_sq:      $scope.project.home_sq,
                project_type: $scope.project.type,
                user_id:      store.get('user').id
            })
            .then(function(response) {
                $('#new_project_modal').modal('hide');
                getProjects();
            }, function(error) {
                $scope.new_project_form.$invalid = true;
            });
        }
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
        $scope.updated_project         = {};
        $scope.updated_project.name    = store.get('project').name;
        $scope.updated_project.address = store.get('project').address;
        $scope.updated_project.city    = store.get('project').city;
        $scope.updated_project.state   = store.get('project').state;
        $scope.updated_project.zipcode = store.get('project').zipcode;
        $scope.updated_project.home_sq = store.get('project').home_sq;
        $scope.edit_project_form.$setPristine();
        $('#edit_project_modal').find('.modal-title').text('Edit Project: ' + store.get('project').name);
        $('#edit_project_modal').find('.modal-title').css('font-weight', 'Bold');
        $('#edit_project_modal').modal('show');
    }
    $scope.updateProject = function() {
        $http.put('/api/projects/' + store.get('project').id, {
            name:    $scope.updated_project.name,
            address: $scope.updated_project.address,
            city:    $scope.updated_project.city,
            state:   $scope.updated_project.state,
            zipcode: $scope.updated_project.zipcode,
            home_sq: $scope.project.home_sq,
            user_id: store.get('user').id
        })
        .then(function(response) {
            $('#edit_project_modal').modal('hide');
            getProjects();
        }, function(error) {
            $scope.edit_project_form.$invalid = true;
        });
    }
});
