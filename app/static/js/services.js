var services = angular.module('services', []);

services.service('UsersService', function($http) {
    // First AJAX function
    this.getUsersList = function() {
        $http.get('/api/users')
            .then(function(response) {
                console.log("MADE IT TO SUCCESS");
                return response.data;
                // this callback will be called asynchronously
                // when the response is available
                // NEED TO FIX THIS (not sending response.data back at the moment)
            }, function(response) {
                console.log("MADE IT TO ERROR");
                return response.status;
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
    }

    this.method2 = function() {
        return 2;
    }
});
