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
.controller('FundsController', function($scope, store, $state) {
    init();

    function init() {
        $scope.username = store.get('username');
    }
    $scope.logOut = function() {
        store.remove('jwt');
        $state.go('login');
    }
});
