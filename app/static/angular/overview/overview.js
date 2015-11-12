var app = angular.module('app.overview', []);

app.config(function($stateProvider) {
    $stateProvider.state('overview', {
        url:         '/overview',
        templateUrl: 'angular/overview/overview.html',
        controller:  'OverviewController',
        data:        {
            requiresLogin: true
        }
    });
});

app.controller('OverviewController', function($scope, store, CategoryService) {
    init();

    function init() {
        $scope.username = store.get('user').username;
        $scope.project_name = store.get('project').name;
        drawBarChart();
        getCategories();
    }
    function drawBarChart() {
        $('#barchart-container').highcharts({
            chart: {
                type: 'bar'
            },
            title: {
                text: '',
                style: {
                    display: 'none'
                }
            },
            subtitle: {
                text: '',
                style: {
                    display: 'none'
                }
            },
            xAxis: {
                categories: ['Apples', 'Bananas', 'Oranges']
            },
            yAxis: {
                title: {
                    text: 'Fruit eaten'
                }
            },
            series: [{
                name: 'Jane',
                data: [1, 0, 4]
            }, {
                name: 'John',
                data: [5, 7, 3]
            }],
            credits: {
                enabled: false
            }
        });
    }
    // GET function
    function getCategories() {
        CategoryService.getCategories().then(function(response) {
            $scope.category_list = response.data.objects;

            var grand_total_estimated   = 0;
            var grand_total_actual      = 0;
            var grand_total_expenditure = 0;

            angular.forEach(response.data.objects, function(category) {
                var total_estimated   = 0;
                var total_actual      = 0;
                var total_expenditure = 0;
                angular.forEach(category.items, function(item) {
                    total_estimated += item.estimated;
                    total_actual    += item.actual;
                });
                angular.forEach(category.expenditures, function(expenditure) {
                    total_expenditure += expenditure.cost;
                });
                category.total_estimated    = total_estimated;
                category.total_actual       = total_actual;
                category.total_expenditure  = total_expenditure;
                grand_total_estimated      += total_estimated;
                grand_total_actual         += total_actual;
                grand_total_expenditure    += total_expenditure;

                if (total_actual === 0 || total_expenditure >= total_actual) {
                    category.paid   = 100;
                    category.unpaid = 0;
                } else {
                    category.paid   = Math.round(total_expenditure / total_actual * 100);
                    category.unpaid = total_actual - total_expenditure;
                }
            });
            $scope.grand_total_estimated   = grand_total_estimated;
            $scope.grand_total_actual      = grand_total_actual;
            $scope.grand_total_expenditure = grand_total_expenditure;

        }, function(error) {
            $scope.error_msg_get = true;
        });
    }
});
