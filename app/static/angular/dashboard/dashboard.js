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
.controller('DashboardController', function($scope, store, $state) {
    init();
    drawBudgetPieChart();
    drawExpendituresPieChart();

    function init() {
        $scope.username = store.get('username');
        $scope.project_name = store.get('project').name;
    }
    function drawBudgetPieChart() {
        var data = [
            {
                value: 300,
                color:"#F7464A",
                highlight: "#FF5A5E",
                label: "Red"
            },
            {
                value: 50,
                color: "#46BFBD",
                highlight: "#5AD3D1",
                label: "Green"
            },
            {
                value: 100,
                color: "#FDB45C",
                highlight: "#FFC870",
                label: "Yellow"
            }
        ];
        var options = {
                responsive : true,
                labelFontSize : '18',
                tooltipTemplate : "<%if (label){%><%=label%>: <%}%>$<%= value.formatMoney(0, '.', ',') %>",
                legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><div class=\"comm-how\">$<%=segments[i].value.formatMoney(0, '.', ',')%></div><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
        };
        var ctx = $('#modular-doughnut').get(0).getContext('2d');
        var chart = new Chart(ctx).Doughnut(data, options);
        var legend = document.createElement('div');
		legend.innerHTML = chart.generateLegend();

        var helpers = Chart.helpers;
		helpers.each(legend.firstChild.childNodes, function(legendNode, index) {
			helpers.addEvent(legendNode, 'mouseover', function() {
				var activeSegment = chart.segments[index];
				activeSegment.save();
				activeSegment.fillColor = activeSegment.highlightColor;
				chart.showTooltip([activeSegment]);
				activeSegment.restore();
			});
		});
		helpers.addEvent(legend.firstChild, 'mouseout', function() {
			chart.draw();
		});
		document.getElementById('legend-holder').appendChild(legend.firstChild);
    }
    function drawExpendituresPieChart() {
        var data = [
            {
                value: 300,
                color:"#F7464A",
                highlight: "#FF5A5E",
                label: "Red"
            },
            {
                value: 50,
                color: "#46BFBD",
                highlight: "#5AD3D1",
                label: "Green"
            },
            {
                value: 100,
                color: "#FDB45C",
                highlight: "#FFC870",
                label: "Yellow"
            }
        ];
        var options = {
                responsive : true,
                labelFontSize : '18',
                tooltipTemplate : "<%if (label){%><%=label%>: <%}%>$<%= value.formatMoney(0, '.', ',') %>",
                legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><div class=\"comm-how\">$<%=segments[i].value.formatMoney(0, '.', ',')%></div><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
        };
        var ctx = $('#modular-doughnut2').get(0).getContext('2d');
        var chart = new Chart(ctx).Doughnut(data, options);
        var legend = document.createElement('div');
		legend.innerHTML = chart.generateLegend();

        var helpers = Chart.helpers;
		helpers.each(legend.firstChild.childNodes, function(legendNode, index) {
			helpers.addEvent(legendNode, 'mouseover', function() {
				var activeSegment = chart.segments[index];
				activeSegment.save();
				activeSegment.fillColor = activeSegment.highlightColor;
				chart.showTooltip([activeSegment]);
				activeSegment.restore();
			});
		});
		helpers.addEvent(legend.firstChild, 'mouseout', function() {
			chart.draw();
		});
		document.getElementById('legend-holder2').appendChild(legend.firstChild);
    }
    $scope.logOut = function() {
        store.remove('jwt');
        $state.go('login');
    }
});
