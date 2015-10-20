angular.module('app.expenditures', [])

.config(function($stateProvider) {
    $stateProvider.state('expenditures', {
        url: '/expenditures',
        templateUrl: 'angular/expenditures/expenditures.html',
        controller: 'ExpendituresController',
        data: {
            requiresLogin: true
        }
    });
})
.controller('ExpendituresController', function($scope, store, $state, $http) {
    init();

    function init() {
        $scope.username = store.get('username');
        getExpenditures();
        getFunds();
        getCategories();
        getItems();
    }
    $scope.logOut = function() {
        store.remove('jwt');
        $state.go('login');
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
            $scope.selected = expenditure.selected;
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
    // GET EXPENDITURES function
    function getExpenditures() {
        $http.get('/api/expenditures?q={"filters":[{"name":"project_id","op":"equals","val":"' + store.get('project').id + '"}]}')
        .then(function(response) {
            console.log(response.data.objects);
            $scope.expenditure_list = response.data.objects;

            var amount_spent = 0;
            angular.forEach(response.data.objects, function(expenditure) {
                amount_spent += expenditure.cost;
            });
            $scope.total_amount_spent = amount_spent;

        }, function(error) {
            $scope.error_msg = 'Could not load your expenses. Please try to refresh the page.';
        });
    }
    // GET FUNDS function
    function getFunds() {
        $http.get('/api/funds?q={"filters":[{"name":"project_id","op":"equals","val":"' + store.get('project').id + '"}]}')
        .then(function(response) {
            $scope.fund_list = response.data.objects;
        }, function(error) {
            $scope.error_msg = 'Could not load your funds/loans. Please try to refresh the page.';
        });
    }
    // GET CATEGORIES function
    function getCategories() {
        $http.get('/api/categories?q={"filters":[{"name":"project_id","op":"equals","val":"' + store.get('project').id + '"}]}')
        .then(function(response) {
            $scope.category_list = response.data.objects;

            var i = 0;
            var expenditures_data = [];
            var expenditures_colors = getColorList($scope.category_list.length, 'coral', 'darkred');

            angular.forEach($scope.category_list, function(category) {
                var total_expenditure = 0;
                angular.forEach(category.expenditures, function(expenditure) {
                    total_expenditure += expenditure.cost;
                });
                expenditures_data.push({
                    value: total_expenditure,
                    color: expenditures_colors[i],
                    highlight: expenditures_colors[i],
                    label: category.name
                });
                i++;
            });
            // Draw Expenditures Pie Chart
            var ctx = $('#modular-doughnut').get(0).getContext('2d');
            var chart = new Chart(ctx).Doughnut(expenditures_data, {
                responsive: true,
                tooltipTemplate: "<%if (label){%><%=label%>: <%}%>$<%= value.formatMoney(0, '.', ',') %>",
                legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><div class=\"comm-how\">$<%=segments[i].value.formatMoney(0, '.', ',')%></div><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
            });
            var legend = document.createElement('div');
    		legend.innerHTML = chart.generateLegend();
            document.getElementById('legend-holder').appendChild(legend.firstChild);

        }, function(error) {
            $scope.error_msg = 'Could not load your project\'s categories. Please try to refresh the page.';
        });
    }
    // GET ITEMS function
    function getItems() {
        $http.get('/api/items?q={"filters":[{"name":"project_id","op":"equals","val":"' + store.get('project').id + '"}]}')
        .then(function(response) {
            var list = [];
            angular.forEach(response.data.objects, function(item) {
                list.push({
                    id: item.id,
                    name: item.name,
                    category: {
                        id: item.categories.id,
                        name: item.categories.name,
                    }
                });
            });
            $scope.item_list = list;
        }, function(error) {
            //$scope.error_msg_add = 'Could not load the item list.';
        });
    }
    // ADD EXPENDITURE functions
    $scope.showAddExpenditureModal = function() {
        $scope.expenditure = {};
        $scope.expenditure.date = new Date();
        $scope.add_expenditure_form.$setPristine();
        $('#add_expenditure_modal').modal('show');
    }
    $scope.addExpenditure = function() {
        console.log($scope.expenditure.item);
        $http.post('/api/expenditures', {
            date: $scope.expenditure.date,
            vendor: $scope.expenditure.vendor,
            notes: $scope.expenditure.notes,
            cost: $scope.expenditure.cost,
            fund_id: $scope.expenditure.fund.id,
            category_id: $scope.expenditure.item.category.id,
            item_id: $scope.expenditure.item.id,
            project_id: store.get('project').id
        })
        .then(function(response) {
            $('#add_expenditure_modal').modal('hide');
            // This needs re-work
            // Add element to expenditure list
            getExpenditures();
        }, function(error) {
            $scope.add_expenditure_form.$invalid = true;
            console.log(error);
        });
    }
    // DELETE EXPENDITURES functions
    $scope.showDeleteExpendituresModal = function() {
        if (!$('#delete_button').hasClass('disabled')) {
            $('#delete_expenditures_modal').modal('show');
        }
    }
    $scope.deleteExpenditures = function() {
        angular.forEach($scope.expenditure_list, function(expenditure) {
            if (expenditure.selected) {
                $http.delete('/api/expenditures/' + expenditure.id)
                .then(function(response) {
                    $('#delete_expenditures_modal').modal('hide');
                    // This needs re-work
                    getExpenditures();
                    $scope.selected = false;
                }, function(error) {
                    $scope.error_msg_delete = 'Could not delete your expense(s). Please try again.';
                });
            }
        });
    }
    // DELETE SINGLE EXPENDITURE functions
    $scope.showSingleDeleteExpenditureModal = function() {
        $('#delete_single_expenditure_modal').modal('show');
    }
    $scope.deleteSingleExpenditure = function() {
        $http.delete('/api/expenditures/' + store.get('expenditure').id)
        .then(function(response) {
            $('#delete_single_expenditure_modal').modal('hide');
            getExpenditures();
        }, function(error) {
            $scope.error_msg_delete_single = 'Could not delete your expense. Please try again.';
        });
    }
    // UPDATE EXPENDITURE functions
    $scope.showEditExpenditureModal = function() {
        $scope.updated_expenditure = {};
        $scope.updated_expenditure.date = new Date(store.get('expenditure').date);
        $scope.updated_expenditure.vendor = store.get('expenditure').vendor;
        // Needs work
        console.log(store.get('expenditure').items.id);
        $scope.updated_expenditure.item = store.get('expenditure').items.id;
        $scope.updated_expenditure.notes = store.get('expenditure').notes;
        $scope.updated_expenditure.cost = store.get('expenditure').cost;
        console.log(store.get('expenditure').funds.id);
        $scope.updated_expenditure.fund = store.get('expenditure').funds.id;
        $scope.edit_expenditure_form.$setPristine();
        $('#edit_expenditure_modal').modal('show');
    }
    $scope.updateExpenditure = function() {
        $http.put('/api/expenditures/' + store.get('expenditure').id, {
            date: $scope.updated_expenditure.date,
            vendor: $scope.updated_expenditure.vendor,
            notes: $scope.updated_expenditure.notes,
            cost: $scope.updated_expenditure.cost,
            fund_id: $scope.updated_expenditure.fund,
            category_id: $scope.updated_expenditure.item.category.id,
            item_id: $scope.updated_expenditure.item.id,
            project_id: store.get('project').id
        })
        .then(function(response) {
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
