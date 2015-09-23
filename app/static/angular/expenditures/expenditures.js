angular.module('app.expenditures', [

])
.config(function($stateProvider) {
    $stateProvider.state('expenditures', {
        url: '/expenditures',
        templateUrl: 'angular/expenditures/expenditures.html',
        controller: 'ExpendituresController'
    })
})
.controller('ExpendituresController', function($scope, store, $state) {
    $scope.username = store.get('username');

    $scope.logOut = function() {
        store.remove('jwt');
        $state.go('login');
    }
    $scope.clickedCheckbox = function() {
        
    }
});
