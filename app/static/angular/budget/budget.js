var app = angular.module('app.budget', []);

app.config(function($stateProvider) {
    $stateProvider.state('budget', {
        url:         '/budget',
        templateUrl: 'angular/budget/budget.html',
        controller:  'BudgetController',
        data:        {
            requiresLogin: true
        }
    });
});

app.controller('BudgetController', function($scope, store, CategoryService, ItemService) {
    init();

    function init() {
        $scope.username = store.get('user').username;
        drawPieChart();
        getCategories();
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
    // GET function
    function drawPieChart() {
        CategoryService.getCategories()
        .then(function(response) {
            var i              = 0;
            var data           = [];
            var colors         = [];
            var start_color    = 'mediumspringgreen';
            var end_color      = 'darkslategray';
            var gray_color     = '#AAAAAA';
            var num_categories = response.data.objects.length;

            if (num_categories == 0) {
                data.push({
                    value:     0.01,
                    color:     gray_color,
                    highlight: gray_color,
                    label:     'No categories'
                });
            } else if (num_categories == 1) {
                colors.push(start_color);
            } else {
                colors = getColorList(num_categories, start_color, end_color);
            }

            angular.forEach(response.data.objects, function(category) {
                var total_actual = 0;

                angular.forEach(category.items, function(item) {
                    total_actual += item.actual;
                });
                data.push({
                    value:     total_actual,
                    color:     colors[i],
                    highlight: colors[i],
                    label:     category.name
                });
                i++;
            });
            var ctx = $('#modular-doughnut').get(0).getContext('2d');
            var chart = new Chart(ctx).Doughnut(data, {
                scaleIntegersOnly: false,
                responsive:        true,
                tooltipTemplate:   "<%if (label){%><%=label%>: <%}%>$<%= value.formatMoney(2, '.', ',') %>",
                legendTemplate:    "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><div class=\"comm-how\">$<%=segments[i].value.formatMoney(2, '.', ',')%></div><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
            });
            var legend       = document.createElement('div');
            legend.innerHTML = chart.generateLegend();
            document.getElementById('legend-holder').appendChild(legend.firstChild);

        }, function(error) {
            $scope.error_msg_get = true;
        });
    }
    function getCategories() {
        CategoryService.getCategories()
        .then(function(response) {
            $scope.category_list = response.data.objects;

            var grand_total_estimated = 0;
            var grand_total_actual    = 0;

            angular.forEach(response.data.objects, function(category) {
                var total_estimated = 0;
                var total_actual    = 0;

                angular.forEach(category.items, function(item) {
                    total_estimated += item.estimated;
                    total_actual    += item.actual;
                });
                category.total_estimated  = total_estimated;
                category.total_actual     = total_actual;
                grand_total_estimated    += total_estimated;
                grand_total_actual       += total_actual;
            });
            $scope.grand_total_estimated = grand_total_estimated;
            $scope.grand_total_actual    = grand_total_actual;

        }, function(error) {
            $scope.error_msg_get = true;
        });
    }
    // ADD functions
    $scope.showAddItemModal = function() {
        $scope.item = {};
        $scope.add_item_form.$setPristine();
        $('#add_item_modal').modal('show');
    }
    $scope.addItem = function() {
        if ($scope.item.new_category) {
            CategoryService.addCategory($scope.item.new_category)
            .then(function(response) {
                $scope.item.category = response.data.id
                addItem($scope.item);
            }, function(error) {
                $scope.add_item_form.$invalid = true;
            });
        } else {
            addItem($scope.item);
        }
    }
    function addItem() {
        ItemService.addItem($scope.item)
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
                    ItemService.deleteItem(item.id)
                    .then(function(response) {
                        $('#delete_items_modal').modal('hide');
                        getCategories();
                        $scope.selected = false;
                    }, function(error) {
                        $scope.error_msg_delete = true;
                    });
                }
            });
        });
    }
    $scope.showSingleDeleteItemModal = function() {
        $('#delete_single_item_modal').modal('show');
    }
    $scope.deleteSingleItem = function() {
        ItemService.deleteItem(store.get('item').id)
        .then(function(response) {
            $('#delete_single_item_modal').modal('hide');
            getCategories();
        }, function(error) {
            $scope.error_msg_delete_single = true;
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
