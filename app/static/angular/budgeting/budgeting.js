angular.module('app.budgeting', ['smart-table'])

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
      $http.get('/api/categories?q={"filters":[{"name":"project_id","op":"equals","val":"' + store.get('project_id') + '"}]}')
      .then(function(response) {
          $scope.categories_list = response.data.objects;
      }, function(response) {
          // Could not load user's project
      });
  }

});

// //Example code from smart table
// .controller('mainCtrl', ['$scope', function ($scope) {
//
//     var
//         nameList = ['Pierre', 'Pol', 'Jacques', 'Robert', 'Elisa'],
//         familyName = ['Dupont', 'Germain', 'Delcourt', 'bjip', 'Menez'];
//
//     function createRandomItem() {
//         var
//             firstName = nameList[Math.floor(Math.random() * 4)],
//             lastName = familyName[Math.floor(Math.random() * 4)],
//             age = Math.floor(Math.random() * 100),
//             email = firstName + lastName + '@whatever.com',
//             balance = Math.random() * 3000;
//
//         return{
//             firstName: firstName,
//             lastName: lastName,
//             age: age,
//             email: email,
//             balance: balance
//         };
//     }
//
//
//     $scope.displayed = [];
//     for (var j = 0; j < 500; j++) {
//         $scope.displayed.push(createRandomItem());
//     }
// }])
// .directive('stRatio',function(){
//     return {
//       link:function(scope, element, attr){
//         var ratio=+(attr.stRatio);
//
//         element.css('width',ratio+'%');
//
//       }
//     };
// });
