var app = angular.module('app.funds', []);

app.config(function($stateProvider) {
    $stateProvider.state('funds', {
        url:         '/funds',
        templateUrl: 'angular/funds/funds.html',
        controller:  'FundsController',
        data:        {
            requiresLogin: true
        }
    });
});

app.controller('FundsController', function($scope, store, FundService, DrawService) {
    init();

    function init() {
        $scope.username = store.get('user').username;
        getFunds();
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
    // GET function
    function getFunds() {
        FundService.getFunds().then(function(response) {
            $scope.fund_list = response.data.objects;

            angular.forEach(response.data.objects, function(fund) {
                var total_expenditure = 0;

                angular.forEach(fund.expenditures, function(expenditure) {
                    total_expenditure += expenditure.cost;
                });
                fund.total_expenditure = total_expenditure;

                var total_draw = 0;
                angular.forEach(fund.draws, function(draw) {
                    total_draw += draw.amount;
                });
                fund.total_draw = total_draw;

                fund.spent = Math.round(total_expenditure / fund.amount * 100);
                fund.left  = Math.round((fund.amount - total_expenditure) / fund.amount * 100);

                fund.draw_received = Math.round(total_draw / fund.amount * 100);
                fund.draw_left     = Math.round((fund.amount - total_draw) / fund.amount * 100);

                $scope.loan_question = [{ value: true, name: 'Yes' },
                                        { value: false, name: 'No' }];
            });
        }, function(error) {
            $scope.error_msg_get = true;
        });
    }
    // ADD FUND functions
    $scope.showAddFundModal = function() {
        $scope.fund = {};
        $scope.add_fund_form.$setPristine();
        $('#add_fund_modal').modal('show');
    }
    $scope.addFund = function() {
        FundService.addFund($scope.fund).then(function(response) {
            $('#add_fund_modal').modal('hide');
            getFunds();
        }, function(error) {
            $scope.add_fund_form.$invalid = true;
        });
    }
    // DELETE FUND functions
    $scope.showDeleteFundModal = function() {
        $scope.error_msg_delete = false;
        $('#delete_fund_modal').modal('show');
    }
    $scope.deleteFundAndDraws = function() {
        if (store.get('fund').draws == 0) {
            deleteFund();
        } else {
            DrawService.deleteBulkDraws().then(function(response) {
                deleteFund();
            }, function(error) {
                $scope.error_msg_delete = true;
            });
        }
    }
    function deleteFund() {
        FundService.deleteFund().then(function(response) {
            $('#delete_fund_modal').modal('hide');
            getFunds();
        }, function(error) {
            $scope.error_msg_delete = true;
        });
    }
    // UPDATE FUND functions
    $scope.showEditFundModal = function() {
        $scope.updated_fund        = {};
        $scope.updated_fund.name   = store.get('fund').name;
        $scope.updated_fund.loan   = store.get('fund').loan;
        $scope.updated_fund.amount = store.get('fund').amount;
        $scope.edit_fund_form.$setPristine();
        $('#edit_fund_modal').modal('show');
    }
    $scope.updateFund = function() {
        FundService.updateFund($scope.updated_fund).then(function(response) {
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
        $('#add_draw_modal').modal('show');
    }
    $scope.addDraw = function() {
        DrawService.addDraw($scope.draw).then(function(response) {
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
                DrawService.deleteDraw(draw.id).then(function(response) {
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
        DrawService.updateDraw().then(function(response) {
            $('#edit_draw_modal').modal('hide');
            getFunds();
        }, function(error) {
            $scope.edit_draw_form.$invalid = true;
        });
    }
});
