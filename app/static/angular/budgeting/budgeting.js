angular.module('app.budgeting', [

])
.config(function($stateProvider) {
    $stateProvider.state('budgeting', {
        url: '/budgeting',
        templateUrl: 'angular/budgeting/budgeting.html',
        controller: 'BudgetingController'
    })
})
.controller('BudgetingController', function($scope, store, $state) {
  // Bootstrap tooltip init
  $('[data-toggle="tooltip"]').tooltip();

  console.log('BudgetingController');
  // Signed in user
  $scope.username = store.get('username');
  // Load user's projects
  getCategories();

  // Log Out function
  $scope.logOut = function() {
      store.remove('jwt');
      $state.go('login');
  }
  // GET PROJECTS function
  function getCategories() {
      console.log('im in getcategories');
      $http.get('/api/categories?q={"filters":[{"name":"project_id","op":"equals","val":"' + store.get('project_id') + '"}]}')
      .then(function(response) {
          console.log(response.data);
          $scope.categories_list = response.data.objects;
      }, function(response) {
          // Could not load user's project
      });
  }

});
