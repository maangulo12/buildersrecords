angular.module('app.budgeting', [])

.config(function($stateProvider) {
    $stateProvider.state('budgeting', {
        url: '/budgeting',
        templateUrl: 'angular/budgeting/budgeting.html',
        controller: 'BudgetingController',
        data: {
            requiresLogin: true
        }
    })
})

.controller('BudgetingController', function($scope, store, $state, $http) {
    init();

    function init() {
        $scope.username = store.get('username');
        getCategories();
    }
    // GET categories function
    function getCategories() {
        $http.get('/api/categories?q={"filters":[{"name":"project_id","op":"equals","val":"' + store.get('project').id + '"}]}')
        .then(function(response) {
            $scope.category_list = response.data.objects;
        }, function(error) {
            $scope.error_msg = 'Could not load your category list. Please try to refresh the page.';
        });
    }
    $scope.logOut = function() {
        store.remove('jwt');
        $state.go('login');
    }
    $scope.clickedItem = function(item) {
        var index = $scope.category.items.indexOf(item);
        if (index !== -1) {
            store.set('item', item);
            return true;
        }
        return false;
    }
    $scope.clickedSingleCheckbox = function(category, item) {
        if (item.selected) {
            $scope.selected = true;
            console.log("khk");
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
    // ADD functions
    $scope.showAddItemModal = function() {
        $scope.item = {};
        $scope.add_item_form.$setPristine();
        $('#add_item_modal').modal('show');
    }
    $scope.addItem = function() {
        $http.post('/api/items', {
            name: $scope.item.name,
            description: $scope.item.description,
            amount: $scope.item.amount,
            notes: $scope.item.notes,
            category_id: $scope.item.category
        })
        .then(function(response) {
            $('#add_item_modal').modal('hide');
            getCategories();
        }, function(error) {
            $scope.add_item_form.$invalid = true;
        });
    }
    // DELETE EXPENDITURES functions
    $scope.showDeleteItemsModal = function() {
        if (!$('#delete_button').hasClass('disabled')) {
            $('#delete_items_modal').modal('show');
        }
    }
    $scope.deleteItems = function() {
      angular.forEach($scope.category_list, function(category) {
        angular.forEach(category.items, function(item) {
            if (item.selected) {
                $http.delete('/api/items/' + item.id)
                .then(function(response) {
                    $('#delete_items_modal').modal('hide');
                    getCategories();
                    $scope.selected = false;
                }, function(error) {
                    $scope.error_msg_delete = 'Could not delete your expense(s). Please try again.';
                });
            }
        });
      });
    }
    $scope.showSingleDeleteItemModal = function() {
        $('#delete_single_item_modal').modal('show');
    }
    $scope.deleteSingleItem = function() {
        $http.delete('/api/items/' + store.get('item').id)
        .then(function(response) {
            $('#delete_single_item_modal').modal('hide');
            getCategories();
        }, function(error) {
            $scope.error_msg_delete_single = 'Could not delete your item. Please try again.';
        });
    }
});
