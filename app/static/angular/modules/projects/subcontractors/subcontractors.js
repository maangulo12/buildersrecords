var app = angular.module('app.projects.subcontractors', []);

app.config(function($stateProvider) {
    $stateProvider.state('subcontractors', {
        url: '/projects/subcontractors',
        views: {
            'nav': {
                templateUrl: 'static/angular/components/navs/nav2.html',
                controller: function($scope, store) {
                    $scope.username = store.get('user').username;
                }
            },
            'body': {
                templateUrl: 'static/angular/modules/projects/subcontractors/subcontractors.html',
                controller: 'SubcontractorController'
            }
        },
        data: {
            requiresLogin: true
        }
    });
});

app.controller('SubcontractorController', function($scope, store, SubcontractorService) {
    init();

    function init() {
        $scope.username = store.get('user').username;
        updateTable();
    }

    // UPDATE TABLE function
    function updateTable() {
        SubcontractorService.getSubcontractors().then(function(response) {
            $scope.subcontractor_list = response.data.objects;
        }, function(error) {
            $scope.error_msg_get = true;
        });
    }

    // CLICKED EVENTS functions
    $scope.clickedSubcontractor = function(subcontractor) {
        var index = $scope.subcontractor_list.indexOf(subcontractor);
        if (index !== -1) {
            store.set('subcontractor', subcontractor);
            return true;
        }
        return false;
    }
    $scope.clickedSingleCheckbox = function(subcontractor) {
        if (subcontractor.selected) {
            $scope.selected = true;
        } else {
            var is_selected = false;
            angular.forEach($scope.subcontractor_list, function(e) {
                if (e.selected) {
                    is_selected = true;
                }
            });
            $scope.selected = is_selected;
        }
    }

    // ADD SUBCONTRACTOR functions
    $scope.showAddSubcontractorModal = function() {
        $scope.addDisabled = false;
        $scope.subcontractor = {};
        $scope.add_subcontractor_form.$setPristine();
        $('#add_subcontractor_modal').modal('show');
    }
    $scope.addSubcontractor = function() {
        $scope.addDisabled = true;
        SubcontractorService.addSubcontractor($scope.subcontractor).then(function(response) {
            $('#add_subcontractor_modal').modal('hide');
            // This needs re-work
            // Add element to the expenditure list
            updateTable();
        }, function(error) {
            $scope.add_subcontractor_form.$invalid = true;
        });
    }

    // DELETE SUBCONTRACTOR functions
    $scope.showDeleteSubcontractorsModal = function() {
        if (!$('#delete_button').hasClass('disabled')) {
            $scope.deleteDisabled = false;
            $scope.error_msg_delete = false;
            $('#delete_subcontractors_modal').modal('show');
        }
    }
    $scope.deleteSubcontractors = function() {
        $scope.deleteDisabled = true;
        angular.forEach($scope.subcontractor_list, function(subcontractor) {
            if (subcontractor.selected) {
                SubcontractorService.deleteSubcontractor(subcontractor.id).then(function(response) {
                    $('#delete_subcontractors_modal').modal('hide');
                    $scope.selected = false;

                    var index = $scope.subcontractor_list.indexOf(subcontractor);
                    if (index !== -1) {
                        $scope.subcontractor_list.splice(index, 1);
                    }
                }, function(error) {
                    $scope.error_msg_delete = true;
                });
            }
        });
    }

    // DELETE SINGLE SUBCONTRACTOR functions
    $scope.showSingleDeleteSubcontractorModal = function() {
        $scope.deleteSingleDisabled = false;
        $scope.error_msg_delete_single = false;
        $('#delete_single_subcontractor_modal').modal('show');
    }
    $scope.deleteSingleSubcontractor = function() {
        $scope.deleteSingleDisabled = true;
        SubcontractorService.deleteSubcontractor(store.get('subcontractor').id).then(function(response) {
            $('#delete_single_subcontractor_modal').modal('hide');

            var index = $scope.subcontractor_list.indexOf(store.get('subcontractor'));
            if (index !== -1) {
                $scope.subcontractor_list.splice(index, 1);
            }
        }, function(error) {
            $scope.error_msg_delete_single = true;
        });
    }

    // UPDATE SUBCONTRACTOR functions
    $scope.showEditSubcontractorModal = function() {
        $scope.updateDisabled = false;
        $scope.updated_subcontractor                = {};
        $scope.updated_subcontractor.name           = store.get('subcontractor').name;
        $scope.updated_subcontractor.company        = store.get('subcontractor').company;
        $scope.updated_subcontractor.contact_number = store.get('subcontractor').contact_number;
        $scope.edit_subcontractor_form.$setPristine();
        $('#edit_subcontractor_modal').modal('show');
    }
    $scope.updateSubcontractor = function() {
        $scope.updateDisabled = true;
        SubcontractorService.updateSubcontractor($scope.updated_subcontractor).then(function(response) {
            $('#edit_subcontractor_modal').modal('hide');
            // This needs re-work
            // Update element in the list
            updateTable();
        }, function(error) {
            $scope.edit_subcontractor_form.$invalid = true;
        });
    }
});
