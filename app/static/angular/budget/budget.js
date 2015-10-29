angular.module('app.budget', [])

.config(function($stateProvider) {
    $stateProvider.state('budget', {
        url: '/budget',
        templateUrl: 'angular/budget/budget.html',
        controller: 'BudgetController',
        data: {
            requiresLogin: true
        }
    });
})
.controller('BudgetController', function($scope, store, $state, $http) {
    init();

    function init() {
        $scope.username = store.get('user').username;
        getCategories();
    }
    // GET categories function
    function getCategories() {
        $http.get('/api/categories?q={"filters":[{"name":"project_id","op":"equals","val":"' + store.get('project').id + '"}]}')
        .then(function(response) {
            $scope.category_list = response.data.objects;

            var i = 0;
            var budget_data = [];
            var budget_colors = getColorList($scope.category_list.length, 'mediumspringgreen', 'darkslategray');

            angular.forEach(response.data.objects, function(category) {
                var total_cost = 0;
                angular.forEach(category.items, function(item) {
                    total_cost += item.amount;
                });
                budget_data.push({
                    value    : total_cost,
                    color    : budget_colors[i],
                    highlight: budget_colors[i],
                    label    : category.name
                });
                i++;
            });
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
            $scope.error_msg = 'Could not load your category list. Please try to refresh the page.';
        });
    }
    $scope.logOut = function() {
        store.remove('jwt');
        $state.go('login');
    }
    $scope.clickedItem = function(item) {
        var index = $scope.category.items.indexOf(item);
        if (index !== -1) {
            store.set('item', item);
            return true;
        }
        return false;
    }
    $scope.clickedSingleCheckbox = function(category, item) {
        if (item.selected) {
            $scope.selected = true;
            console.log("khk");
        } else {
            var is_selected = false;
            angular.forEach(category.items, function(e) {
                if (e.selected) {
                    is_selected = true;
                }
            });
            $scope.selected = is_selected;
        }
    }
    // ADD functions
    $scope.showAddItemModal = function() {
        $scope.item = {};
        $scope.add_item_form.$setPristine();
        $('#add_item_modal').modal('show');
    }
    $scope.addItem = function() {
        $http.post('/api/items', {
            name       : $scope.item.name,
            description: $scope.item.description,
            amount     : $scope.item.amount,
            notes      : $scope.item.notes,
            category_id: $scope.item.category
        })
        .then(function(response) {
            $('#add_item_modal').modal('hide');
            getCategories();
        }, function(error) {
            $scope.add_item_form.$invalid = true;
        });
    }
    // DELETE EXPENDITURES functions
    $scope.showDeleteItemsModal = function() {
        if (!$('#delete_button').hasClass('disabled')) {
            $('#delete_items_modal').modal('show');
        }
    }
    $scope.deleteItems = function() {
        angular.forEach($scope.category_list, function(category) {
            angular.forEach(category.items, function(item) {
                if (item.selected) {
                    $http.delete('/api/items/' + item.id)
                    .then(function(response) {
                        $('#delete_items_modal').modal('hide');
                        getCategories();
                        $scope.selected = false;
                    }, function(error) {
                        $scope.error_msg_delete = 'Could not delete your expense(s). Please try again.';
                    });
                }
            });
        });
    }
    $scope.showSingleDeleteItemModal = function() {
        $('#delete_single_item_modal').modal('show');
    }
    $scope.deleteSingleItem = function() {
        $http.delete('/api/items/' + store.get('item').id)
        .then(function(response) {
            $('#delete_single_item_modal').modal('hide');
            getCategories();
        }, function(error) {
            $scope.error_msg_delete_single = 'Could not delete your item. Please try again.';
        });
    }
    // UTILITY functions
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
