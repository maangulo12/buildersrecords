angular.module('app.expenditures', [])

.config(function($stateProvider) {
    $stateProvider.state('expenditures', {
        url: '/expenditures',
        templateUrl: 'angular/expenditures/expenditures.html',
        controller: 'ExpendituresController',
        data: {
            requiresLogin: true
        }
    });
})
.controller('ExpendituresController', function($scope, store, $state, $http) {
    init();

    function init() {
        $scope.username = store.get('username');
        getExpenditures();
    }
    // GET function
    function getExpenditures() {
        $http.get('/api/expenditures?q={"filters":[{"name":"project_id","op":"equals","val":"' + store.get('project_id') + '"}]}')
        .then(function(response) {
            $scope.expenditure_list = response.data.objects;
        }, function(error) {
            $scope.error_msg = 'Could not load your expenses. Please refresh your page.';
        });
    }
    $scope.logOut = function() {
        store.remove('jwt');
        $state.go('login');
    }
    $scope.clickedExpenditure = function(expenditure) {
        var index = $scope.expenditure_list.indexOf(expenditure);
        if (index !== -1) {
            store.set('expenditure_id', expenditure.id);
            store.set('expenditure_date', expenditure.date);
            store.set('expenditure_vendor', expenditure.vendor);
            store.set('expenditure_description', expenditure.description);
            store.set('expenditure_amount', expenditure.amount);
            store.set('expenditure_notes', expenditure.notes);
            return true;
        }
        return false;
    }
    $scope.clickedAllCheckbox = function() {
        angular.forEach($scope.expenditure_list, function(expenditure) {
            expenditure.Selected = $scope.checkboxAll;
            $scope.selected = expenditure.Selected;
        });
    }
    $scope.clickedSingleCheckbox = function(expenditure) {
        $scope.selected = expenditure.Selected;
    }
    // ADD functions
    $scope.showAddExpenditureModal = function() {
        $scope.date = new Date();
        $scope.vendor = '';
        $scope.description = '';
        $scope.amount = '';
        $scope.notes = '';
        $scope.add_expenditure_form.$setPristine();
        $('#add_expenditure_modal').modal('show');
    }
    $scope.addExpenditure = function() {
        $http.post('/api/expenditures', {
            date: $scope.date,
            vendor: $scope.vendor,
            description: $scope.description,
            amount: $scope.amount,
            notes: $scope.notes,
            loan: true,
            project_id: store.get('project_id')
        })
        .then(function(response) {
            $('#add_expenditure_modal').modal('hide');
            getExpenditures();
        }, function(error) {
            $scope.add_expenditure_form.$invalid = true;
        });
    }
    // DELETE functions
    $scope.showDeleteExpendituresModal = function() {
        if (!$('#delete_button').hasClass('disabled')) {
            $('#delete_expenditures_modal').modal('show');
        }
    }
    $scope.deleteExpenditures = function() {
        angular.forEach($scope.expenditure_list, function(expenditure) {
            if (expenditure.Selected) {
                $http.delete('/api/expenditures/' + expenditure.id)
                .then(function(response) {
                    $('#delete_expenditures_modal').modal('hide');
                    getExpenditures();
                    $scope.selected = false;
                }, function(error) {
                    $scope.error_msg = 'Could not delete your expense(s). Please try again.';
                });
            }
        });
    }
    // UPDATE functions
    $scope.showEditExpenditureModal = function() {
        $scope.updated_date = new Date(store.get('expenditure_date'));
        $scope.updated_vendor = store.get('expenditure_vendor');
        $scope.updated_description = store.get('expenditure_description');
        $scope.updated_amount = store.get('expenditure_amount');
        $scope.updated_notes = store.get('expenditure_notes');
        $scope.edit_expenditure_form.$setPristine();
        $('#edit_expenditure_modal').modal('show');
    }
    $scope.updateExpenditure = function() {
        $http.put('/api/expenditures/' + store.get('expenditure_id'), {
            date: $scope.updated_date,
            vendor: $scope.updated_vendor,
            description: $scope.updated_description,
            amount: $scope.updated_amount,
            notes: $scope.updated_notes,
            loan: true,
            project_id: store.get('project_id')
        })
        .then(function(response) {
            $('#edit_expenditure_modal').modal('hide');
            getExpenditures();
        }, function(error) {
            $scope.edit_expenditure_form.$invalid = true;
        });
    }
});
