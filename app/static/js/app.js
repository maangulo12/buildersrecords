var app = angular.module('app', ['ngRoute']);

app.config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: '../partials/view1.html',
			controller: 'AppController'
		})
		.when('/view2', {
			templateUrl: '../partials/view2.html',
			controller: 'AppController'
		})
		.otherwise({ redirectTo: '/' });
});

app.controller('AppController', function ($scope) {
    $scope.message = "I'm running Flask and AngularJS!";
});
