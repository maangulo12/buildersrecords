angular.module('app.dashboard', [

])
.config(function($stateProvider) {
    $stateProvider.state('dashboard', {
        url: '/dashboard',
        templateUrl: 'angular/dashboard/dashboard.html',
        controller: 'DashboardController'
    })
})
.controller('DashboardController', function($scope, $state, store){
    $scope.signed_user = store.get('signed_user');

    $scope.logOut = function() {
        store.remove('jwt');
        $state.go('login');
    }
    // This function redirects to the budgeting page
    $scope.redirectBudgeting = function() {
        $state.go('budgeting');
    }
    // This function redirects to the loan management page
    $scope.redirectLoanManagement = function() {
        $state.go('loan_management');
    }
    // This function redirects to the sub contractor page
    $scope.redirectSubContractor = function() {
        $state.go('sub_contractor');
    }

});
