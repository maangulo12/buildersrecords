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
    // GET EXPENDITURES function
    function getExpenditures() {
        $http.get('/api/expenditures?q={"filters":[{"name":"user_id","op":"equals","val":"' + store.get('user_id') + '"}]}')
        .then(function(response) {
            $scope.project_list = response.data.objects;
        }, function(response) {
            // Could not load user's project
        });
    }
});
