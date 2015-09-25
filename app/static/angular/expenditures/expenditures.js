angular.module('app.expenditures', [

])
.config(function($stateProvider) {
    $stateProvider.state('expenditures', {
        url: '/expenditures',
        templateUrl: 'angular/expenditures/expenditures.html',
        controller: 'ExpendituresController'
    })
})
.controller('ExpendituresController', function($scope, store, $state, $http) {
    $scope.username = store.get('username');
    getExpenditures();

    $scope.logOut = function() {
        store.remove('jwt');
        $state.go('login');
    }
    $scope.clickedCheckbox = function() {

    }
    // GET EXPENDITURES function
    function getExpenditures() {
        $http.get('/api/expenditures?q={"filters":[{"name":"project_id","op":"equals","val":"' + store.get('project_id') + '"}]}')
        .then(function(response) {
            $scope.expenditure_list = response.data.objects;
        }, function(response) {
            // Could not load user's project
        });
    }
});
