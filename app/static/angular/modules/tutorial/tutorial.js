var app = angular.module('app.tutorial', []);

app.config(function($stateProvider) {
    $stateProvider.state('tutorial', {
        url: '/tutorial',
        resolve: {
            UserObj: function(User, $q) {
                return User.retrieve().then(responseHandler, errorHandler);
                function responseHandler(response) {
                    return response.data;
                }
                function errorHandler(response) {
                    return $q.reject(response.data);
                }
            }
        },
        views: {
            'nav': {
                templateUrl: 'static/angular/components/navs/nav2.html',
                controller: function($scope, UserObj) {
                    $scope.username = UserObj.username;
                }
            },
            'body': {
                templateUrl: 'static/angular/modules/tutorial/tutorial.html',
                controller: 'TutorialController'
            }
        },
        data: {
            requiresLogin: true
        }
    });
});

app.controller('TutorialController', function() {

});
