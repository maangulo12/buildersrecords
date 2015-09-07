angular.module('app.projects', [
    'ui.router',
    'angular-storage',
    'app.services'
])
.config(function($stateProvider) {
    $stateProvider.state('projects', {
        url: '/projects',
        templateUrl: 'angular/projects/projects.html',
        controller: 'ProjectsController'
    })
})
.controller('ProjectsController', function($scope, store, $state) {
    $scope.signed_user = store.get('signed_user');
    $scope.logOut = function() {
        store.remove('jwt');
        $state.go('login');
    }
});
