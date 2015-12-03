var app = angular.module('app.projects.budget', []);

app.config(function($stateProvider) {
    $stateProvider.state('budget', {
        url: '/projects/budget',
        views: {
            'nav': {
                templateUrl: 'static/angular/components/navs/nav2.html',
                controller: function($scope, store) {
                    $scope.username = store.get('user').username;
                }
            },
            'body': {
                templateUrl: 'static/angular/modules/projects/budget/budget.html',
                controller: 'BudgetController'
            }
        },
        data: {
            requiresLogin: true
        }
    });
});

app.controller('BudgetController', function($scope, store, CategoryService, ItemService, ExpenditureService) {
    var options = {};
    var piechart = null;
    init();

    function init() {
        $scope.username = store.get('user').username;
        initPiechart();
        updatePiechart();
        updateTable();
    }

    // PIECHART functions
    function initPiechart() {
        options = {
            chart: {
                type: 'pie',
                style: {
                    fontFamily: "Montserrat, 'Helvetica Neue', Helvetica, Arial, sans-serif"
                }
            },
            title: {
                text: ''
            },
            tooltip: {
                headerFormat: '<span style="font-size: 14px"> {point.key} </span><br>',
                pointFormat:  "<span style=\"font-size: 14px\"> <b> ${point.y:.2f} </b> </span><br>"
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<span style="font-size: 14px"> {point.name} </span><br> {point.percentage:.2f}%'
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
                    if (category.items.length != 0) {
                        var category_total = 0;

                        angular.forEach(category.items, function(item) {
                            category_total += item.actual;
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

    // UPDATE TABLE function
    function updateTable() {
        CategoryService.getCategories().then(function(response) {
            $scope.category_list = response.data.objects;

            var grand_total_estimated = 0;
            var grand_total_actual    = 0;

            angular.forEach(response.data.objects, function(category) {
                var total_estimated = 0;
                var total_actual    = 0;

                angular.forEach(category.items, function(item) {
                    total_estimated += item.estimated;
                    total_actual    += item.actual;
                });
                category.total_estimated  = total_estimated;
                category.total_actual     = total_actual;
                grand_total_estimated    += total_estimated;
                grand_total_actual       += total_actual;
            });
            $scope.grand_total_estimated = grand_total_estimated;
            $scope.grand_total_actual    = grand_total_actual;

        }, function(error) {
            $scope.error_msg_get = true;
        });
    }

    // CLICKED EVENTS functions
    $scope.clickedItem = function(item) {
        var index = store.get('category').items.indexOf(item);
        if (index !== -1) {
            store.set('item', item);
            return true;
        }
        return false;
    }
    $scope.clickedSingleCheckbox = function(category, item) {
        if (item.selected) {
            $scope.selected = true;
        } else {
            var is_selected = false;
            angular.forEach(category.items, function(e) {
                if (e.selected) {
                    is_selected = true;
                }
            });
            $scope.selected = is_selected;
        }
    }
    $scope.clickedCategory = function(category) {
        var index = $scope.category_list.indexOf(category);
        if (index !== -1) {
            store.set('category', category);
            return true;
        }
        return false;
    }

    // ADD functions
    $scope.showAddItemModal = function() {
        $scope.addDisabled = false;
        $scope.item = {};
        $scope.add_item_form.$setPristine();
        $('#add_item_modal').modal('show');
    }
    $scope.addItem = function() {
        $scope.addDisabled = true;
        if ($scope.item.new_category) {
            CategoryService.addCategory($scope.item.new_category).then(function(response) {
                $scope.item.category = response.data.id;
                addItem($scope.item);
            }, function(error) {
                $scope.add_item_form.$invalid = true;
            });
        } else {
            addItem($scope.item);
        }
    }
    function addItem() {
        ItemService.addItem($scope.item).then(function(response) {
            $('#add_item_modal').modal('hide');
            updatePiechart();
            // This needs re-work
            // Add element to item list
            updateTable();
        }, function(error) {
            $scope.add_item_form.$invalid = true;
        });
    }

    // DELETE ITEMS functions
    $scope.showDeleteItemsModal = function() {
        if (!$('#delete_button').hasClass('disabled')) {
            $scope.deleteDisabled = false;
            $scope.error_msg_delete = false;
            $('#delete_items_modal').modal('show');
        }
    }
    $scope.deleteItems = function() {
        $scope.deleteDisabled = true;
        var failed = false;
        angular.forEach($scope.category_list, function(category) {
            angular.forEach(category.items, function(item) {
                if (item.selected) {
                    ItemService.deleteItem(item.id).then(function(response) {
                        $('#delete_items_modal').modal('hide');
                        $scope.selected = false;
                        updatePiechart();
                        // This needs re-work
                        // Delete element from item list
                        updateTable();
                    }, function(error) {
                        failed = true;
                        $scope.error_msg_delete = true;
                    });
                }
            });
        });
    }

    // DELETE SINGLE ITEM functions
    $scope.showSingleDeleteItemModal = function() {
        $scope.deleteSingleDisabled = false;
        $scope.error_msg_delete_single = false;
        $('#delete_single_item_modal').modal('show');
    }
    $scope.deleteSingleItem = function() {
        $scope.deleteSingleDisabled = false;
        ItemService.deleteItem(store.get('item').id).then(function(response) {
            $('#delete_single_item_modal').modal('hide');
            updatePiechart();
            // This needs re-work
            // Delete element from item list
            updateTable();
        }, function(error) {
            $scope.error_msg_delete_single = true;
        });
    }

    // UPDATE ITEM functions
    $scope.showEditItemModal = function() {
        $scope.updateDisabled = false;
        $scope.updated_item             = {};
        $scope.updated_item.category    = {
            id:   store.get('category').id,
            name: store.get('category').name
        };
        $scope.updated_item.name        = store.get('item').name;
        $scope.updated_item.description = store.get('item').description;
        $scope.updated_item.estimated   = store.get('item').estimated;
        $scope.updated_item.actual      = store.get('item').actual;
        $scope.edit_item_form.$setPristine();
        $('#edit_item_modal').modal('show');
    }
    $scope.updateItem = function() {
        $scope.updateDisabled = true;
        ItemService.updateItem($scope.updated_item).then(function(response) {
            $('#edit_item_modal').modal('hide');
            updatePiechart();
            // This needs re-work
            // Update element from item list
            updateTable();
        }, function(error) {
            $scope.edit_item_form.$invalid = true;
        });
    }

    // DELETE CATEGORY functions
    $scope.showDeleteCategoryModal = function() {
        $scope.deleteCategoryDisabled = false;
        $scope.error_msg_delete_category = false;
        $('#delete_category_modal').modal('show');
    }
    $scope.deleteCategory = function() {
        $scope.deleteCategoryDisabled = true;

        ExpenditureService.getExpendituresByCategory().then(function(response) {
            var expenditures = response.data.num_results;

            ItemService.getItemsByCategory().then(function(response) {
                var items = response.data.num_results;

                if (expenditures == 0 && items == 0) {
                    CategoryService.deleteCategory().then(function(response) {
                        $('#delete_category_modal').modal('hide');
                        updatePiechart();
                        updateTable();
                    }, function(error) {
                        $scope.error_msg_delete_category = true;
                    });
                } else if (expenditures != 0 && items != 0) {
                    ExpenditureService.deleteBulkExpenditures().then(function(response) {
                        ItemService.deleteBulkItems().then(function(response) {
                            CategoryService.deleteCategory().then(function(response) {
                                $('#delete_category_modal').modal('hide');
                                updatePiechart();
                                updateTable();
                            }, function(error) {
                                $scope.error_msg_delete_category = true;
                            });
                        }, function(error) {
                            $scope.error_msg_delete_category = true;
                        });
                    }, function(error) {
                        $scope.error_msg_delete_category = true;
                    });
                } else if (expenditures != 0 && items == 0) {
                    ExpenditureService.deleteBulkExpenditures().then(function(response) {
                        CategoryService.deleteCategory().then(function(response) {
                            $('#delete_category_modal').modal('hide');
                            updatePiechart();
                            updateTable();
                        }, function(error) {
                            $scope.error_msg_delete_category = true;
                        });
                    }, function(error) {
                        $scope.error_msg_delete_category = true;
                    });
                } else {
                    ItemService.deleteBulkItems().then(function(response) {
                        CategoryService.deleteCategory().then(function(response) {
                            $('#delete_category_modal').modal('hide');
                            updatePiechart();
                            updateTable();
                        }, function(error) {
                            $scope.error_msg_delete_category = true;
                        });
                    }, function(error) {
                        $scope.error_msg_delete_category = true;
                    });
                }
            });
        });
    }

    // UPDATE CATEGORY functions
    $scope.showEditCategoryModal = function() {
        $scope.updateCategoryDisabled = false;
        $scope.category = {};
        $scope.category.name = store.get('category').name
        $scope.edit_category_form.$setPristine();
        $('#edit_category_modal').modal('show');
    }
    $scope.updateCategory = function() {
        $scope.updateCategoryDisabled = true;
        CategoryService.updateCategory($scope.category.name).then(function(response) {
            $('#edit_category_modal').modal('hide');
            updatePiechart();
            updateTable();
        }, function(error) {
            $scope.add_item_form.$invalid = true;
        });
    }
});
