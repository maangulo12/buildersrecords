var app = angular.module('app.projects.overview', []);

app.config(function($stateProvider) {
    $stateProvider.state('overview', {
        url: '/projects/overview',
        views: {
            'nav': {
                templateUrl: 'static/angular/components/navs/nav2.html',
                controller: function($scope, store) {
                    $scope.username = store.get('user').username;
                }
            },
            'body': {
                templateUrl: 'static/angular/modules/projects/overview/overview.html',
                controller: 'OverviewController'
            }
        },
        data: {
            requiresLogin: true
        }
    });
});

app.controller('OverviewController', function($scope, store, CategoryService) {
    var options = {};
    var barchart = null;
    $scope.project = store.get('project');
    initBarchart();
    updateBarchart();
    getCategories();

    function initBarchart() {
        options = {
            chart: {
                type: 'column'
            },
            title: {
                text: ''
            },
            tooltip: {
                headerFormat: '<span style="font-size:14px"> {point.key} </span><table>',
                pointFormat:  '<tr><td style="color: {series.color}"> {series.name}: </td>' +
                              '<td> <b> ${point.y:.2f} </b> </td></tr>',
                footerFormat: '</table>',
                shared:       true,
                useHTML:      true
            },
            xAxis: {
                categories: [],
                crosshair: true
            },
            yAxis: {
                title: {
                    text: 'Dollars'
                }
            },
            series: [{
                name: 'Estimated Cost',
                data: []
            }, {
                name: 'Actual Cost',
                data: []
            }, {
                name: 'Paid',
                data: []
            }],
            credits: {
                enabled: false
            }
        };

        barchart = $('#barchart-container').highcharts(options);
    }
    function updateBarchart() {
        CategoryService.getCategories().then(function(response) {
            options.xAxis.categories = [];
            options.series[0].data   = [];
            options.series[1].data   = [];
            options.series[2].data   = [];

            if (response.data.objects.length == 0) {
                options.xAxis.categories.push('No categories');
                options.series[0].data.push(0.00);
                options.series[1].data.push(0.00);
                options.series[2].data.push(0.00);
            } else {
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
                    options.xAxis.categories.push(category.name);
                    options.series[0].data.push(total_estimated);
                    options.series[1].data.push(total_actual);
                    options.series[2].data.push(total_expenditure);
                });
            }
            barchart = new Highcharts.Chart(options);

        }, function(error) {
            $scope.error_msg_get = true;
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

                if (total_expenditure >= total_actual) {
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
