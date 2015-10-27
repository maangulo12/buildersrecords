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

            var i = 0;
            var grand_total_cost = 0;
            var grand_total_expenditure = 0;

            var budget_data = [];
            var budget_colors = getColorList($scope.category_list.length, 'mediumspringgreen', 'darkslategray');

            angular.forEach($scope.category_list, function(category) {

                var total_cost = 0;
                angular.forEach(category.items, function(item) {
                    total_cost += item.amount;
                });
                category.total_cost = total_cost;
                grand_total_cost += total_cost;

                budget_data.push({
                    value: total_cost,
                    color: budget_colors[i],
                    highlight: budget_colors[i],
                    label: category.name
                });

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
                i++;
            });
            $scope.grand_total_cost = grand_total_cost;
            $scope.grand_total_expenditure = grand_total_expenditure;

            // Draw Budget Pie Chart
            var ctx = $('#modular-doughnut').get(0).getContext('2d');
            var chart = new Chart(ctx).Doughnut(budget_data, {
                responsive: true,
                tooltipTemplate: "<%if (label){%><%=label%>: <%}%>$<%= value.formatMoney(0, '.', ',') %>",
                legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><div class=\"comm-how\">$<%=segments[i].value.formatMoney(0, '.', ',')%></div><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
            });
            var legend = document.createElement('div');
    		legend.innerHTML = chart.generateLegend();
            document.getElementById('legend-holder').appendChild(legend.firstChild);

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
