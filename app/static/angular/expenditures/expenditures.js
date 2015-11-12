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

app.controller('ExpendituresController', function($scope, store, $state, CategoryService, ExpenditureService, ItemService, FundService) {
    var options = {};
    var piechart = null;
    init();

    function init() {
        $scope.username = store.get('user').username;
        initPiechart();
        updatePiechart();
        getExpenditures();
        getItems();
        getFunds();
    }

    // PIECHART functions
    function initPiechart() {
        options = {
            chart: {
                type: 'pie'
            },
            title: {
                text: ''
            },
            tooltip: {
                headerFormat: '<span style="font-size: 14px"> {point.key} </span><br>',
                pointFormat:  "<span style=\"font-size: 14px\"> <b> ${point.y:.2f} </b> <br> <b> {point.percentage:.2f}% </b> </span><br>"
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}',
                        style: {
                            fontSize: '12.5px'
                        }
                    }
                }
            },
            series: [{
                name: 'Categories',
                data: []
            }],
            credits: {
                enabled: false
            }
        };

        piechart = $('#piechart-container').highcharts(options);
    }
    function updatePiechart() {
        CategoryService.getCategories().then(function(response) {
            options.series[0].data = [];

            if (response.data.objects.length == 0) {
                options.series[0].data.push({ name: 'No Categories', y: 0.01 });
            } else {
                angular.forEach(response.data.objects, function(category) {
                    if (category.expenditures.length != 0) {
                        var category_total = 0;

                        angular.forEach(category.expenditures, function(expenditure) {
                            category_total += expenditure.cost;
                        });
                        options.series[0].data.push({ name: category.name, y: category_total });
                    }
                });
            }
            piechart = new Highcharts.Chart(options);

        }, function(error) {
            $scope.error_msg_get = true;
        });
    }

    // CLICKED EVENTS
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
            $scope.selected      = expenditure.selected;
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
    // GET ITEMS function: Dropdown in modals
    function getItems() {
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
    // GET FUNDS function: Dropdown in modals
    function getFunds() {
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

    // ADD EXPENDITURE functions: ADD Modal
    $scope.showAddExpenditureModal = function() {
        $scope.expenditure = {};
        $scope.expenditure.date = new Date();
        $scope.add_expenditure_form.$setPristine();
        $('#add_expenditure_modal').modal('show');
    }
    $scope.addExpenditure = function() {
        ExpenditureService.addExpenditure($scope.expenditure).then(function(response) {
            $('#add_expenditure_modal').modal('hide');
            updatePiechart();
            // This needs re-work
            // Add element to the expenditure list
            getExpenditures();
        }, function(error) {
            $scope.add_expenditure_form.$invalid = true;
        });
    }

    // DELETE EXPENDITURES functions: DELETE Modal
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
        updatePiechart();
    }

    // DELETE SINGLE EXPENDITURE functions: DELETE SINGLE Modal
    $scope.showSingleDeleteExpenditureModal = function() {
        $scope.error_msg_delete_single = false;
        $('#delete_single_expenditure_modal').modal('show');
    }
    $scope.deleteSingleExpenditure = function() {
        ExpenditureService.deleteExpenditure(store.get('expenditure').id).then(function(response) {
            $('#delete_single_expenditure_modal').modal('hide');
            updatePiechart();

            var index = $scope.expenditure_list.indexOf(store.get('expenditure'));
            if (index !== -1) {
                $scope.expenditure_list.splice(index, 1);
            }
        }, function(error) {
            $scope.error_msg_delete_single = true;
        });
    }

    // UPDATE EXPENDITURE functions: UPDATE Modal
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
            updatePiechart();
            // This needs re-work
            // Update element in the list
            getExpenditures();
        }, function(error) {
            $scope.edit_expenditure_form.$invalid = true;
        });
    }
});
