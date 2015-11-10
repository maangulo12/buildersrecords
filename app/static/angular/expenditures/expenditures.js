var app = angular.module('app.expenditures', []);

app.config(function($stateProvider) {
    $stateProvider.state('expenditures', {
        url:         '/expenditures',
        templateUrl: 'angular/expenditures/expenditures.html',
        controller:  'ExpendituresController',
        data:        {
            requiresLogin: true
        }
    });
});

app.controller('ExpendituresController', function($scope, store, CategoryService, ExpenditureService, ItemService, FundService) {
    init();

    function init() {
        $scope.username = store.get('user').username;
        getCategories();
        getExpenditures();
        getItems();
        getFunds();
    }
    $scope.clickedExpenditure = function(expenditure) {
        var index = $scope.expenditure_list.indexOf(expenditure);
        if (index !== -1) {
            store.set('expenditure', expenditure);
            return true;
        }
        return false;
    }
    $scope.clickedAllCheckbox = function() {
        angular.forEach($scope.expenditure_list, function(expenditure) {
            expenditure.selected = $scope.checkboxAll;
            $scope.selected      = expenditure.selected;
        });
    }
    $scope.clickedSingleCheckbox = function(expenditure) {
        if (expenditure.selected) {
            $scope.selected = true;
        } else {
            var is_selected = false;
            angular.forEach($scope.expenditure_list, function(e) {
                if (e.selected) {
                    is_selected = true;
                }
            });
            $scope.selected = is_selected;
        }
    }
    // GET CATEGORIES function: Displays Piechart
    function getCategories() {
        CategoryService.getCategories().then(function(response) {
            var i              = 0;
            var data           = [];
            var colors         = [];
            var start_color    = 'coral';
            var end_color      = 'darkred';
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
                var category_total = 0;

                angular.forEach(category.expenditures, function(expenditure) {
                    category_total += expenditure.cost;
                });
                data.push({
                    value    : category_total,
                    color    : colors[i],
                    highlight: colors[i],
                    label    : category.name
                });
                i++;
            });
            // Draw Pie Chart
            var ctx   = $('#modular-doughnut').get(0).getContext('2d');
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
    // GET EXPENDITURES function: Displays the table
    function getExpenditures() {
        ExpenditureService.getExpenditures().then(function(response) {
            $scope.expenditure_list = response.data.objects;

            var total = 0;
            angular.forEach(response.data.objects, function(expenditure) {
                total += expenditure.cost;
            });
            $scope.total_cost = total;

        }, function(error) {
            $scope.error_msg_get = true;
        });
    }
    // GET ITEMS function: Dropdown in modals
    function getItems() {
        ItemService.getItems().then(function(response) {
            var list = [];
            angular.forEach(response.data.objects, function(item) {
                list.push({
                    id  : item.id,
                    name: item.name,
                    category: {
                        id  : item.categories.id,
                        name: item.categories.name,
                    }
                });
            });
            $scope.item_list = list;

        }, function(error) {
            $scope.error_msg_get = true;
        });
    }
    // GET FUNDS function: Dropdown in modals
    function getFunds() {
        FundService.getFunds().then(function(response) {
            var list = [];
            angular.forEach(response.data.objects, function(fund) {
                list.push({
                    id  : fund.id,
                    name: fund.name
                });
            });
            $scope.fund_list = list;

        }, function(error) {
            $scope.error_msg_get = true;
        });
    }
    // ADD EXPENDITURE functions: ADD Modal
    $scope.showAddExpenditureModal = function() {
        $scope.expenditure = {};
        $scope.expenditure.date = new Date();
        $scope.add_expenditure_form.$setPristine();
        $('#add_expenditure_modal').modal('show');
    }
    $scope.addExpenditure = function() {
        ExpenditureService.addExpenditure($scope.expenditure).then(function(response) {
            $('#add_expenditure_modal').modal('hide');
            // This needs re-work
            // Add element to the expenditure list
            getExpenditures();
        }, function(error) {
            $scope.add_expenditure_form.$invalid = true;
        });
    }
    // DELETE EXPENDITURES functions: DELETE Modal
    $scope.showDeleteExpendituresModal = function() {
        if (!$('#delete_button').hasClass('disabled')) {
            $scope.error_msg_delete = false;
            $('#delete_expenditures_modal').modal('show');
        }
    }
    $scope.deleteExpenditures = function() {
        var i = 0;
        var list_length = $scope.expenditure_list.length;
        angular.forEach($scope.expenditure_list, function(expenditure) {
            if (expenditure.selected) {
                ExpenditureService.deleteExpenditure(expenditure.id).then(function(response) {
                    var index = $scope.expenditure_list.indexOf(expenditure);
                    if (index !== -1) {
                        $scope.expenditure_list.splice(index, 1);
                    }
                }, function(error) {
                    $scope.error_msg_delete = true;
                });
            }
            if (i == list_length - 1) {
                $('#delete_expenditures_modal').modal('hide');
                $scope.selected = false;
            }
            i++;
        });
    }
    // DELETE SINGLE EXPENDITURE functions: DELETE SINGLE Modal
    $scope.showSingleDeleteExpenditureModal = function() {
        $scope.error_msg_delete_single = false;
        $('#delete_single_expenditure_modal').modal('show');
    }
    $scope.deleteSingleExpenditure = function() {
        ExpenditureService.deleteExpenditure(store.get('expenditure').id).then(function(response) {
            $('#delete_single_expenditure_modal').modal('hide');
            var index = $scope.expenditure_list.indexOf(store.get('expenditure'));
            if (index !== -1) {
                $scope.expenditure_list.splice(index, 1);
            }
        }, function(error) {
            $scope.error_msg_delete_single = true;
        });
    }
    // UPDATE EXPENDITURE functions: UPDATE Modal
    $scope.showEditExpenditureModal = function() {
        $scope.updated_expenditure        = {};
        $scope.updated_expenditure.date   = new Date(store.get('expenditure').date);
        $scope.updated_expenditure.vendor = store.get('expenditure').vendor;
        $scope.updated_expenditure.item   = {
            id  : store.get('expenditure').items.id,
            name: store.get('expenditure').items.name,
            category: {
                id  : store.get('expenditure').categories.id,
                name: store.get('expenditure').categories.name,
            }
        };
        $scope.updated_expenditure.notes = store.get('expenditure').notes;
        $scope.updated_expenditure.cost = store.get('expenditure').cost;
        $scope.updated_expenditure.fund = {
            id  : store.get('expenditure').funds.id,
            name: store.get('expenditure').funds.name
        };
        $scope.edit_expenditure_form.$setPristine();
        $('#edit_expenditure_modal').modal('show');
    }
    $scope.updateExpenditure = function() {
        ExpenditureService.updateExpenditure($scope.updated_expenditure).then(function(response) {
            $('#edit_expenditure_modal').modal('hide');
            // This needs re-work
            // Update element in the list
            getExpenditures();
        }, function(error) {
            $scope.edit_expenditure_form.$invalid = true;
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
