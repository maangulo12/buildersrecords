var app = angular.module('app.expenditures', []);

app.config(function($stateProvider) {
    $stateProvider.state('expenditures', {
        url:         '/expenditures',
        templateUrl: 'angular/expenditures/expenditures.html',
        controller:  'ExpendituresController',
        data:        {
            requiresLogin: true
        }
    });
});

app.controller('ExpendituresController', function($scope, store, CategoryService, ExpenditureService, ItemService, FundService) {
    init();

    function init() {
        $scope.username = store.get('user').username;
        updateProgressBars();
        updateTable();
        populateItemsDropdown();
        populateFundsDropdown();
    }

    // UPDATE PROGRESS BARS function
    function updateProgressBars() {
        CategoryService.getCategories().then(function(response) {
            $scope.category_list = response.data.objects;

            angular.forEach(response.data.objects, function(category) {
                var total_expenditure = 0;
                var total_actual = 0;

                angular.forEach(category.expenditures, function(expenditure) {
                    total_expenditure += expenditure.cost;
                });
                angular.forEach(category.items, function(item) {
                    total_actual += item.actual;
                });
                category.total_expenditure = total_expenditure;
                category.total_actual = total_actual;

                if (total_expenditure > total_actual) {
                    category.over = total_expenditure - total_actual;
                    category.spent = 100;
                } else {
                    category.spent = Math.round(total_expenditure / total_actual * 100);
                    category.left  = total_actual - total_expenditure;
                }
            });
        }, function(error) {
            $scope.error_msg_get = true;
        });
    }

    // UPDATE TABLE function
    function updateTable() {
        ExpenditureService.getExpenditures().then(function(response) {
            $scope.expenditure_list = response.data.objects;

            var total = 0;
            angular.forEach(response.data.objects, function(expenditure) {
                total += expenditure.cost;
            });
            $scope.total_cost = total;

        }, function(error) {
            $scope.error_msg_get = true;
        });
    }

    // CLICKED EVENTS functions
    $scope.clickedExpenditure = function(expenditure) {
        var index = $scope.expenditure_list.indexOf(expenditure);
        if (index !== -1) {
            store.set('expenditure', expenditure);
            return true;
        }
        return false;
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


    // POPULATE ITEMS DROPDOWN function
    function populateItemsDropdown() {
        ItemService.getItems().then(function(response) {
            var list = [];
            angular.forEach(response.data.objects, function(item) {
                list.push({
                    id  : item.id,
                    name: item.name,
                    category: {
                        id  : item.categories.id,
                        name: item.categories.name,
                    }
                });
            });
            $scope.item_list = list;

        }, function(error) {
            $scope.error_msg_get = true;
        });
    }

    // POPULATE FUNDS DROPDOWN function
    function populateFundsDropdown() {
        FundService.getFunds().then(function(response) {
            var list = [];
            angular.forEach(response.data.objects, function(fund) {
                list.push({
                    id  : fund.id,
                    name: fund.name
                });
            });
            $scope.fund_list = list;

        }, function(error) {
            $scope.error_msg_get = true;
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
        ExpenditureService.addExpenditure($scope.expenditure).then(function(response) {
            $('#add_expenditure_modal').modal('hide');
            updateProgressBars();
            // This needs re-work
            // Add element to the expenditure list
            updateTable();
        }, function(error) {
            $scope.add_expenditure_form.$invalid = true;
        });
    }

    // DELETE EXPENDITURES functions
    $scope.showDeleteExpendituresModal = function() {
        if (!$('#delete_button').hasClass('disabled')) {
            $scope.error_msg_delete = false;
            $('#delete_expenditures_modal').modal('show');
        }
    }
    $scope.deleteExpenditures = function() {
        var i = 0;
        var list_length = $scope.expenditure_list.length;
        angular.forEach($scope.expenditure_list, function(expenditure) {
            if (expenditure.selected) {
                ExpenditureService.deleteExpenditure(expenditure.id).then(function(response) {
                    var index = $scope.expenditure_list.indexOf(expenditure);
                    if (index !== -1) {
                        $scope.expenditure_list.splice(index, 1);
                    }
                }, function(error) {
                    $scope.error_msg_delete = true;
                });
            }
            if (i == list_length - 1) {
                $('#delete_expenditures_modal').modal('hide');
                $scope.selected = false;
            }
            i++;
        });
        updateProgressBars();
    }

    // DELETE SINGLE EXPENDITURE functions
    $scope.showSingleDeleteExpenditureModal = function() {
        $scope.error_msg_delete_single = false;
        $('#delete_single_expenditure_modal').modal('show');
    }
    $scope.deleteSingleExpenditure = function() {
        ExpenditureService.deleteExpenditure(store.get('expenditure').id).then(function(response) {
            $('#delete_single_expenditure_modal').modal('hide');
            updateProgressBars();

            var index = $scope.expenditure_list.indexOf(store.get('expenditure'));
            if (index !== -1) {
                $scope.expenditure_list.splice(index, 1);
            }
        }, function(error) {
            $scope.error_msg_delete_single = true;
        });
    }

    // UPDATE EXPENDITURE functions
    $scope.showEditExpenditureModal = function() {
        $scope.updated_expenditure        = {};
        $scope.updated_expenditure.date   = new Date(store.get('expenditure').date);
        $scope.updated_expenditure.vendor = store.get('expenditure').vendor;
        $scope.updated_expenditure.item   = {
            id  : store.get('expenditure').items.id,
            name: store.get('expenditure').items.name,
            category: {
                id  : store.get('expenditure').categories.id,
                name: store.get('expenditure').categories.name,
            }
        };
        $scope.updated_expenditure.notes = store.get('expenditure').notes;
        $scope.updated_expenditure.cost = store.get('expenditure').cost;
        $scope.updated_expenditure.fund = {
            id  : store.get('expenditure').funds.id,
            name: store.get('expenditure').funds.name
        };
        $scope.edit_expenditure_form.$setPristine();
        $('#edit_expenditure_modal').modal('show');
    }
    $scope.updateExpenditure = function() {
        ExpenditureService.updateExpenditure($scope.updated_expenditure).then(function(response) {
            $('#edit_expenditure_modal').modal('hide');
            updateProgressBars();
            // This needs re-work
            // Update element in the list
            updateTable();
        }, function(error) {
            $scope.edit_expenditure_form.$invalid = true;
        });
    }
});
