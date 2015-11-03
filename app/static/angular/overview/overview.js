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
        $scope.username = store.get('user').username;
        $scope.project_name = store.get('project').name;
        getCategories();
    }
    function getCategories() {
        $http.get('/api/categories?q={"filters":[{"name":"project_id","op":"equals","val":"' + store.get('project').id + '"}]}')
        .then(function(response) {
            $scope.category_list = response.data.objects;

            var grand_total_budget = 0;
            var grand_total_actual = 0;
            var grand_total_expenditure = 0;

            angular.forEach(response.data.objects, function(category) {
                var total_actual = 0;
                var total_budget = 0;
                angular.forEach(category.items, function(item) {
                    total_budget += item.budget;
                    total_actual += item.actual;
                });
                category.total_budget = total_budget;
                category.total_actual = total_actual;
                grand_total_budget += total_budget;
                grand_total_actual += total_actual;

                var total_expenditure = 0;
                angular.forEach(category.expenditures, function(expenditure) {
                    total_expenditure += expenditure.cost;
                });
                category.total_expenditure = total_expenditure;
                grand_total_expenditure += total_expenditure;

                if (total_actual === 0 || total_expenditure >= total_actual) {
                    category.paid = 100;
                    category.unpaid = 0;
                } else {
                    category.paid = Math.round(total_expenditure / total_actual * 100);
                    category.unpaid = total_actual - total_expenditure;
                }
            });
            $scope.grand_total_budget = grand_total_budget;
            $scope.grand_total_actual = grand_total_actual;
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
