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
        $scope.username = store.get('username');
        getFunds();
    }
    $scope.logOut = function() {
        store.remove('jwt');
        $state.go('login');
    }
    // GET function
    function getFunds() {
        $http.get('/api/funds?q={"filters":[{"name":"project_id","op":"equals","val":"' + store.get('project_id') + '"}]}')
        .then(function(response) {
            $scope.fund_list = response.data.objects;
            console.log($scope.fund_list);
        }, function(error) {
            $scope.error_msg = 'Could not load your funds/loans. Please try to refresh the page.';
        });
    }
    // ADD functions
    $scope.showAddFundModal = function() {
        $scope.name = '';
        $scope.amount = '';
        $scope.add_fund_form.$setPristine();
        $('#add_fund_modal').modal('show');
    }
    $scope.addFund = function() {
        $http.post('/api/funds', {
            name: $scope.name,
            amount: $scope.amount,
            project_id: store.get('project_id')
        })
        .then(function(response) {
            $('#add_fund_modal').modal('hide');
            getFunds();
        }, function(error) {
            $scope.add_fund_form.$invalid = true;
        });
    }
});
