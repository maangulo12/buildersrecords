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

            var data = {};
            var labels = [];
            var estimated = [];
            var actual = [];
            var paid = [];
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
                labels.push(category.name);
                estimated.push(total_budget);
                actual.push(total_actual);
                paid.push(total_expenditure);
            });

            $scope.grand_total_budget = grand_total_budget;
            $scope.grand_total_actual = grand_total_actual;
            $scope.grand_total_expenditure = grand_total_expenditure;

            data = {
                labels: labels,
                datasets: [
                    {
                        label: 'Estimated Budget',
                        fillColor: "rgba(220, 220, 220, 0.5)",
                        strokeColor: "rgba(220, 220, 220, 0.8)",
                        highlightFill: "rgba(220, 220, 220, 0.75)",
                        highlightStroke: "rgba(220, 220, 220, 1)",
                        data: estimated
                    },
                    {
                        label: 'Actual Job Cost',
                        fillColor: "rgba(151, 187, 205, 0.5)",
                        strokeColor: "rgba(151, 187, 205, 0.8)",
                        highlightFill: "rgba(151, 187, 205, 0.75)",
                        highlightStroke: "rgba(151, 187, 205, 1)",
                        data: actual
                    },
                    {
                        label: 'Paid',
                        fillColor: "rgba(90, 198, 127, 0.5)",
                        strokeColor: "rgba(90, 198, 127, 0.8)",
                        highlightFill: "rgba(90, 198, 127, 0.75)",
                        highlightStroke: "rgba(90, 198, 127, 1)",
                        data: paid
                    }
                ]
            };
            // Draw Bar Chart
            var ctx = $('#modular-bar').get(0).getContext('2d');
            var chart = new Chart(ctx).Bar(data, {
                scaleFontSize: 0,
                barValueSpacing: 15,
                responsive: true,
                multiTooltipTemplate: "<%if (label){%><%=label%>: <%}%>$<%= value.formatMoney(2, '.', ',') %>"
            });
        }, function(error) {
            $scope.error_msg = 'Could not load your cost review table.';
        });
    }
    $scope.logOut = function() {
        store.remove('jwt');
        $state.go('login');
    }
    // UTILITY functions
    Number.prototype.formatMoney = function(c, d, t) {
        var n = this,
            c = isNaN(c = Math.abs(c)) ? 2 : c,
            d = d == undefined ? "." : d,
            t = t == undefined ? "," : t,
            s = n < 0 ? "-" : "",
            i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
            j = (j = i.length) > 3 ? j % 3 : 0;
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    }
});
