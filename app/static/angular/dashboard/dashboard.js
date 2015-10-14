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

            var expenditures_data = [];
            var expenditures_colors = getColorList($scope.category_list.length, 'coral', 'darkred');

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
                    total_expenditure += expenditure.amount;
                });
                category.total_expenditure = total_expenditure;
                grand_total_expenditure += total_expenditure;

                expenditures_data.push({
                    value: total_expenditure,
                    color: expenditures_colors[i],
                    highlight: expenditures_colors[i],
                    label: category.name
                });

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

            // Draw Expenditures Pie Chart
            var ctx2 = $('#modular-doughnut2').get(0).getContext('2d');
            var chart2 = new Chart(ctx2).Doughnut(expenditures_data, {
                responsive: true,
                tooltipTemplate: "<%if (label){%><%=label%>: <%}%>$<%= value.formatMoney(0, '.', ',') %>",
                legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><div class=\"comm-how\">$<%=segments[i].value.formatMoney(0, '.', ',')%></div><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
            });
            var legend2 = document.createElement('div');
    		legend2.innerHTML = chart2.generateLegend();
            document.getElementById('legend-holder2').appendChild(legend2.firstChild);

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
    };
});
