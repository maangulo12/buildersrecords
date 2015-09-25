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
        angular.forEach($scope.expenditure_list, function(expenditure) {
            expenditure.Selected = $scope.checkboxAll;
            $scope.selected = expenditure.Selected;
        });
    }
    $scope.clickedSingleCheckbox = function(expenditure) {
        $scope.selected = expenditure.Selected;
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
    // DELETE functions
    $scope.showDeleteExpendituresModal = function() {
        if (!$('#delete_button').hasClass('disabled')) {
            $('#delete_expenditures_modal').modal('show');
        }
    }
    $scope.deleteExpenditures = function() {
        angular.forEach($scope.expenditure_list, function(expenditure) {
            if (expenditure.Selected) {
                $http.delete('/api/expenditures/' + expenditure.id)
                .then(function(response) {
                    $('#delete_expenditures_modal').modal('hide');
                    getExpenditures();
                }, function(error) {
                    // Could not delete expenditures
                });
            }
        });
    }
});
