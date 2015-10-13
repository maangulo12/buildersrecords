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
        var index = $scope.item_list.indexOf(item);
        if (index !== -1) {
            store.set('item', item);
            return true;
        }
        return false;
    }
    $scope.clickedAllCheckbox = function() {
        angular.forEach($scope.item_list, function(item) {
            item.Selected = $scope.checkboxAll;
            $scope.selected = item.Selected;
        });
    }
    $scope.clickedSingleCheckbox = function(item) {
        $scope.selected = item.Selected;
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
            category: $scope.item.category,
            description: $scope.item.description,
            amount: $scope.item.amount,
            notes: $scope.item.notes,
            project_id: store.get('project').id
        })
        .then(function(response) {
            $('#add_item_modal').modal('hide');
            getCategories();
        }, function(error) {
            $scope.add_item_form.$invalid = true;
        });
    }

});
