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
