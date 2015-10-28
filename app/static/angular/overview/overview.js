angular.module('app.overview', [])

.config(function($stateProvider) {
    $stateProvider.state('overview', {
        url: '/overview',
        templateUrl: 'angular/overview/overview.html',
        controller: 'OverviewController',
        data: {
            requiresLogin: true
        }
    });
})
.controller('OverviewController', function($scope, store, $state, $http) {
    init();

    function init() {
        $scope.username = store.get('username');
        $scope.project_name = store.get('project').name;
        getCategories();
    }
    function getCategories() {
        $http.get('/api/categories?q={"filters":[{"name":"project_id","op":"equals","val":"' + store.get('project').id + '"}]}')
        .then(function(response) {
            $scope.category_list = response.data.objects;

            var grand_total_cost = 0;
            var grand_total_expenditure = 0;

            angular.forEach(response.data.objects, function(category) {

                var total_cost = 0;
                angular.forEach(category.items, function(item) {
                    total_cost += item.amount;
                });
                category.total_cost = total_cost;
                grand_total_cost += total_cost;

                var total_expenditure = 0;
                angular.forEach(category.expenditures, function(expenditure) {
                    total_expenditure += expenditure.cost;
                });
                category.total_expenditure = total_expenditure;
                grand_total_expenditure += total_expenditure;

                if (total_cost === 0 || total_expenditure >= total_cost) {
                    category.paid = 100;
                    category.remaining = 0;
                } else {
                    category.paid = Math.round(total_expenditure / total_cost * 100);
                    category.remaining = total_cost - total_expenditure;
                }
            });
            $scope.grand_total_cost = grand_total_cost;
            $scope.grand_total_expenditure = grand_total_expenditure;

        }, function(error) {
            $scope.error_msg = 'Could not load your cost review table.';
        });
    }
    $scope.logOut = function() {
        store.remove('jwt');
        $state.go('login');
    }
});
