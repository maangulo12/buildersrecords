angular.module('app.dashboard', [])

.config(function($stateProvider) {
    $stateProvider.state('dashboard', {
        url: '/dashboard',
        templateUrl: 'angular/dashboard/dashboard.html',
        controller: 'DashboardController',
        data: {
            requiresLogin: true
        }
    });
})
.controller('DashboardController', function($scope, store, $state, $http) {
    init();

    function init() {
        $scope.username = store.get('username');
        $scope.project_name = store.get('project').name;
        drawPieCharts();
    }
    function drawPieCharts() {
        $http.get('/api/categories?q={"filters":[{"name":"project_id","op":"equals","val":"' + store.get('project').id + '"}]}')
        .then(function(response) {
            $scope.category_list = response.data.objects;

            var i = 0;

            var budget_data = [];
            var budget_colors = getColorList($scope.category_list.length, 'mediumspringgreen', 'darkslategray');

            var expenditures_data = [];
            var expenditures_colors = getColorList($scope.category_list.length, 'crimson', 'brown');

            angular.forEach($scope.category_list, function(category) {

                var category_cost = 0;
                angular.forEach(category.items, function(item) {
                    category_cost += item.amount;
                });

                budget_data.push({
                    value: category_cost,
                    color: budget_colors[i],
                    highlight: budget_colors[i],
                    label: category.name
                });

                var category_expenditure = 0;
                angular.forEach(category.expenditures, function(expenditure) {
                    category_expenditure += expenditure.amount;
                });

                expenditures_data.push({
                    value: category_expenditure,
                    color: expenditures_colors[i],
                    highlight: expenditures_colors[i],
                    label: category.name
                });

                i++;
            });

            var ctx = $('#modular-doughnut').get(0).getContext('2d');
            var chart = new Chart(ctx).Doughnut(budget_data, {
                responsive: true
            });

            var ctx2 = $('#modular-doughnut2').get(0).getContext('2d');
            var chart2 = new Chart(ctx2).Doughnut(expenditures_data, {
                responsive: true
            });
        }, function(error) {
            $scope.error_msg = 'Could not load your budget pie chart.';
        });
    }
    $scope.logOut = function() {
        store.remove('jwt');
        $state.go('login');
    }
    function getColorList(num_items, start_spec, end_spec) {
        var colors = [];
        var rainbow = new Rainbow();
        rainbow.setNumberRange(1, num_items);
        rainbow.setSpectrum(start_spec, end_spec);

        for (var i = 1; i <= num_items; i++) {
            colors.push('#' + rainbow.colourAt(i));
        }
        return colors;
    }
});
