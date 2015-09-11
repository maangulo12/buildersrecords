// This module implements the functions that access the backend of the application.
// This needs work since it is using http. Restangular needs to be used here.
angular.module('app.services', [

])
.service('usersService', function($http) {
    this.getUsersInfoByUsername = function(username) {
        return $http.get('/api/users?q={"filters":[{"name":"username","op":"equals","val":"' + username + '"}]}');
    }
    this.getUsersInfoByEmail = function(email) {
        return $http.get('/api/users?q={"filters":[{"name":"email","op":"equals","val":"' + email + '"}]}');
    }
});
