angular.module('app.expenditures', [])

.config(function($stateProvider) {
    $stateProvider.state('expenditures', {
        url: '/expenditures',
        templateUrl: 'angular/expenditures/expenditures.html',
        controller: 'ExpendituresController'
    });
})
.controller('ExpendituresController', function($scope, store, $state, $http) {
    init();

    function init() {
        $('#delete_button').addClass('disabled');
        $scope.username = store.get('username');
        getExpenditures();
    }
    // GET function
    function getExpenditures() {
        $http.get('/api/expenditures?q={"filters":[{"name":"project_id","op":"equals","val":"' + store.get('project_id') + '"}]}')
        .then(function(response) {
            $scope.expenditure_list = response.data.objects;
        }, function(error) {
            // Could not load user's project
        });
    }
    $scope.logOut = function() {
        store.remove('jwt');
        $state.go('login');
    }
    $scope.clickedAllCheckbox = function() {
        
    }
    // ADD functions
    $scope.showAddExpenditureModal = function() {
        $scope.date = '';
        $scope.add_expenditure_form.$setPristine();
        $('#add_expenditure_modal').modal('show');
    }
    $scope.addExpenditure = function() {
        $http.post('/api/expenditures', {
            date: $scope.date,
            vendor: 'Vendor Name',
            description: 'Description',
            notes: 'Notes',
            loan: true,
            project_id: store.get('project_id')
        })
        .then(function(response) {
            $('#add_expenditure_modal').modal('hide');
            getExpenditures();
        }, function(error) {
            $scope.add_expenditure_form.$invalid = true;
            $scope.add_expenditure_form.date.$invalid = true;
        });
    }
});
