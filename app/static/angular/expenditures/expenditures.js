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
        getFunds();
        getCategories();
    }
    $scope.logOut = function() {
        store.remove('jwt');
        $state.go('login');
    }
    $scope.clickedExpenditure = function(expenditure) {
        var index = $scope.expenditure_list.indexOf(expenditure);
        if (index !== -1) {
            store.set('expenditure', expenditure);
            return true;
        }
        return false;
    }
    $scope.clickedAllCheckbox = function() {
        angular.forEach($scope.expenditure_list, function(expenditure) {
            expenditure.selected = $scope.checkboxAll;
            $scope.selected = expenditure.selected;
        });
    }
    $scope.clickedSingleCheckbox = function(expenditure) {
        if (expenditure.selected) {
            $scope.selected = true;
        } else {
            var is_selected = false;
            angular.forEach($scope.expenditure_list, function(e) {
                if (e.selected) {
                    is_selected = true;
                }
            });
            $scope.selected = is_selected;
        }
    }
    // GET EXPENDITURES function
    function getExpenditures() {
        $http.get('/api/expenditures?q={"filters":[{"name":"project_id","op":"equals","val":"' + store.get('project').id + '"}]}')
        .then(function(response) {
            $scope.expenditure_list = response.data.objects;

            var amount_spent = 0;
            angular.forEach($scope.expenditure_list, function(expenditure) {
                amount_spent += expenditure.amount;
            });
            $scope.total_amount_spent = amount_spent;

        }, function(error) {
            $scope.error_msg = 'Could not load your expenses. Please try to refresh the page.';
        });
    }
    // GET FUNDS function
    function getFunds() {
        $http.get('/api/funds?q={"filters":[{"name":"project_id","op":"equals","val":"' + store.get('project').id + '"}]}')
        .then(function(response) {
            $scope.fund_list = response.data.objects;
        }, function(error) {
            $scope.error_msg = 'Could not load your funds/loans. Please try to refresh the page.';
        });
    }
    // GET CATEGORIES function
    function getCategories() {
        $http.get('/api/categories?q={"filters":[{"name":"project_id","op":"equals","val":"' + store.get('project').id + '"}]}')
        .then(function(response) {
            $scope.category_list = response.data.objects;
        }, function(error) {
            $scope.error_msg = 'Could not load your project\'s categories. Please try to refresh the page.';
        });
    }
    // ADD EXPENDITURE functions
    $scope.showAddExpenditureModal = function() {
        $scope.expenditure = {};
        $scope.expenditure.date = new Date();
        $scope.add_expenditure_form.$setPristine();
        $('#add_expenditure_modal').modal('show');
    }
    $scope.addExpenditure = function() {
        $http.post('/api/expenditures', {
            date: $scope.expenditure.date,
            vendor: $scope.expenditure.vendor,
            description: $scope.expenditure.description,
            amount: $scope.expenditure.amount,
            notes: $scope.expenditure.notes,
            category_id: $scope.expenditure.category,
            fund_id: $scope.expenditure.fund,
            project_id: store.get('project').id
        })
        .then(function(response) {
            $('#add_expenditure_modal').modal('hide');
            getExpenditures();
        }, function(error) {
            $scope.add_expenditure_form.$invalid = true;
            console.log(error);
        });
    }
    // DELETE EXPENDITURES functions
    $scope.showDeleteExpendituresModal = function() {
        if (!$('#delete_button').hasClass('disabled')) {
            $('#delete_expenditures_modal').modal('show');
        }
    }
    $scope.deleteExpenditures = function() {
        angular.forEach($scope.expenditure_list, function(expenditure) {
            if (expenditure.selected) {
                $http.delete('/api/expenditures/' + expenditure.id)
                .then(function(response) {
                    $('#delete_expenditures_modal').modal('hide');
                    getExpenditures();
                    $scope.selected = false;
                }, function(error) {
                    $scope.error_msg_delete = 'Could not delete your expense(s). Please try again.';
                });
            }
        });
    }
    $scope.showSingleDeleteExpenditureModal = function() {
        $('#delete_single_expenditure_modal').modal('show');
    }
    $scope.deleteSingleExpenditure = function() {
        $http.delete('/api/expenditures/' + store.get('expenditure').id)
        .then(function(response) {
            $('#delete_single_expenditure_modal').modal('hide');
            getExpenditures();
        }, function(error) {
            $scope.error_msg_delete_single = 'Could not delete your expense. Please try again.';
        });
    }
    // UPDATE EXPENDITURE functions
    $scope.showEditExpenditureModal = function() {
        $scope.updated_expenditure = {};
        $scope.updated_expenditure.date = new Date(store.get('expenditure').date);
        $scope.updated_expenditure.vendor = store.get('expenditure').vendor;
        $scope.updated_expenditure.description = store.get('expenditure').description;
        $scope.updated_expenditure.category = store.get('expenditure').category;
        $scope.updated_expenditure.amount = store.get('expenditure').amount;
        $scope.updated_expenditure.fund = store.get('expenditure').fund;
        $scope.updated_expenditure.notes = store.get('expenditure').notes;
        $scope.edit_expenditure_form.$setPristine();
        $('#edit_expenditure_modal').modal('show');
    }
    $scope.updateExpenditure = function() {
        $http.put('/api/expenditures/' + store.get('expenditure').id, {
            date: $scope.updated_expenditure.date,
            vendor: $scope.updated_expenditure.vendor,
            description: $scope.updated_expenditure.description,
            amount: $scope.updated_expenditure.amount,
            notes: $scope.updated_expenditure.notes,
            category_id: $scope.updated_expenditure.category,
            fund_id: $scope.updated_expenditure.fund,
            project_id: store.get('project').id
        })
        .then(function(response) {
            $('#edit_expenditure_modal').modal('hide');
            getExpenditures();
        }, function(error) {
            $scope.edit_expenditure_form.$invalid = true;
        });
    }
});
