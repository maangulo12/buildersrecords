angular.module('app.funds', [])

.config(function($stateProvider) {
    $stateProvider.state('funds', {
        url: '/funds',
        templateUrl: 'angular/funds/funds.html',
        controller: 'FundsController',
        data: {
            requiresLogin: true
        }
    });
})
.controller('FundsController', function($scope, store, $state, $http) {
    init();

    function init() {
        $scope.username = store.get('user').username;
        getFunds();
    }
    $scope.logOut = function() {
        store.remove('jwt');
        $state.go('login');
    }
    $scope.clickedFund = function(fund) {
        var index = $scope.fund_list.indexOf(fund);
        if (index !== -1) {
            store.set('fund', fund);
            return true;
        }
        return false;
    }
    $scope.clickedDraw = function(draw) {
        var index = store.get('fund').draws.indexOf(draw);
        if (index !== -1) {
            store.set('draw', draw);
            return true;
        }
        return false;
    }
    $scope.clickedAllCheckbox = function() {
        angular.forEach(store.get('fund').draws, function(draw) {
            draw.selected = store.get('fund').checkboxAll;
            store.get('fund').selected = draw.selected;
        });
    }
    $scope.clickedSingleCheckbox = function(draw) {
        if (draw.selected) {
            store.get('fund').selected = true;
        } else {
            var is_selected = false;
            angular.forEach(store.get('fund').draws, function(d) {
                if (d.selected) {
                    is_selected = true;
                }
            });
            store.get('fund').selected = is_selected;
        }
    }
    // GET FUNDS function
    function getFunds() {
        $http.get('/api/funds?q={"filters":[{"name":"project_id","op":"equals","val":"' + store.get('project').id + '"}]}')
        .then(function(response) {
            $scope.fund_list = response.data.objects;

            angular.forEach($scope.fund_list, function(fund) {
                var draw_amount = 0;
                angular.forEach(fund.draws, function(draw) {
                    draw_amount += draw.amount;
                });
                fund.total_draw = draw_amount;
            });
        }, function(error) {
            $scope.error_msg = 'Could not load your funds/loans. Please try to refresh the page.';
        });
    }
    // ADD FUND functions
    $scope.showAddFundModal = function() {
        $scope.fund = {};
        $scope.add_fund_form.$setPristine();
        $('#add_fund_modal').modal('show');
    }
    $scope.addFund = function() {
        $http.post('/api/funds', {
            name      : $scope.fund.name,
            loan      : $scope.fund.loan,
            amount    : $scope.fund.amount,
            project_id: store.get('project').id
        })
        .then(function(response) {
            $('#add_fund_modal').modal('hide');
            getFunds();
        }, function(error) {
            $scope.add_fund_form.$invalid = true;
        });
    }
    // DELETE FUND functions
    $scope.showDeleteFundModal = function() {
        $('#delete_fund_modal').find('.modal-title').text('Delete your fund/loan: ' + store.get('fund').name);
        $('#delete_fund_modal').find('.modal-title').addClass('text-danger');
        $('#delete_fund_modal').find('.modal-title').css('font-weight', 'Bold');
        $scope.error_msg_delete = false;
        $('#delete_fund_modal').modal('show');
    }
    $scope.deleteFundAndDraws = function() {
        if (store.get('fund').draws == 0) {
            deleteFund();
        } else {
            // Delete all draws for that fund
            $http.delete('/api/draws?q={"filters":[{"name":"fund_id","op":"equals","val":"' + store.get('fund').id + '"}]}')
            .then(function(response) {
                deleteFund();
            }, function(error) {
                $scope.error_msg_delete = 'Could not delete your draws for that fund/loan.';
            });
        }
    }
    function deleteFund() {
        // Delete fund
        $http.delete('/api/funds/' + store.get('fund').id)
        .then(function(response) {
            $('#delete_fund_modal').modal('hide');
            getFunds();
        }, function(error) {
            $scope.error_msg_delete = 'Could not delete your fund/loan.';
        });
    }
    // UPDATE FUND functions
    $scope.showEditFundModal = function() {
        $scope.updated_fund = {};
        $scope.updated_fund.name = store.get('fund').name;
        $scope.updated_fund.loan = store.get('fund').loan;
        $scope.updated_fund.amount = store.get('fund').amount;
        $scope.edit_fund_form.$setPristine();
        $('#edit_fund_modal').find('.modal-title').text('Edit - ' + store.get('fund').name);
        $('#edit_fund_modal').find('.modal-title').css('font-weight', 'Bold');
        $('#edit_fund_modal').modal('show');
    }
    $scope.updateFund = function() {
        $http.put('/api/funds/' + store.get('fund').id, {
            name      : $scope.updated_fund.name,
            loan      : $scope.updated_fund.loan,
            amount    : $scope.updated_fund.amount,
            project_id: store.get('project').id
        })
        .then(function(response) {
            $('#edit_fund_modal').modal('hide');
            getFunds();
        }, function(error) {
            $scope.edit_fund_form.$invalid = true;
        });
    }
    // ADD DRAW functions
    $scope.showAddDrawModal = function() {
        $scope.draw = {};
        $scope.draw.date = new Date();
        $scope.add_draw_form.$setPristine();
        $('#add_draw_modal').find('.modal-title').text('Add a Draw for ' + store.get('fund').name);
        $('#add_draw_modal').find('.modal-title').css('font-weight', 'Bold');
        $('#add_draw_modal').modal('show');
    }
    $scope.addDraw = function() {
        $http.post('/api/draws', {
            date   : $scope.draw.date,
            amount : $scope.draw.amount,
            fund_id: store.get('fund').id
        })
        .then(function(response) {
            $('#add_draw_modal').modal('hide');
            getFunds();
        }, function(error) {
            $scope.add_draw_form.$invalid = true;
        });
    }
    // DELETE DRAWS functions
    $scope.showDeleteDrawsModal = function() {
        if (store.get('fund').selected) {
            $scope.error_msg_delete_draws = false;
            $('#delete_draws_modal').modal('show');
        }
    }
    $scope.deleteDraws = function() {
        angular.forEach(store.get('fund').draws, function(draw) {
            if (draw.selected) {
                $http.delete('/api/draws/' + draw.id)
                .then(function(response) {
                    $('#delete_draws_modal').modal('hide');
                    getFunds();
                    store.get('fund').selected = false;
                }, function(error) {
                    $scope.error_msg_delete_draws = 'Could not delete your draw(s).';
                });
            }
        });
    }
    // UPDATE DRAW functions
    $scope.showEditDrawModal = function() {
        $scope.updated_draw = {};
        $scope.updated_draw.date = new Date(store.get('draw').date);
        $scope.updated_draw.amount = store.get('draw').amount;
        $scope.edit_draw_form.$setPristine();
        $('#edit_draw_modal').modal('show');
    }
    $scope.updateDraw = function() {
        $http.put('/api/draws/' + store.get('draw').id, {
            date   : $scope.updated_draw.date,
            amount : $scope.updated_draw.amount,
            fund_id: store.get('fund').id
        })
        .then(function(response) {
            $('#edit_draw_modal').modal('hide');
            getFunds();
        }, function(error) {
            $scope.edit_draw_form.$invalid = true;
        });
    }
});
