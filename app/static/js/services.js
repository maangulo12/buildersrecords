angular.module('app.services', [])

.service('usersService', function($http) {
    this.isUsernameUnique = function(username) {
        return $http.get('/api/users?q={"filters":[{"name":"username","op":"equals","val":"' + username + '"}]}');
    }

    this.isEmailUnique = function(email) {
        return $http.get('/api/users?q={"filters":[{"name":"email","op":"equals","val":"' + email + '"}]}');
    }

    this.getAllUsers = function() {
        return $http.get('/api/users');
    }

    this.addUser = function(username, password, first_name, last_name, email) {
        return $http.post('/api/users', {
            username: username,
            password: password,
            first_name: first_name,
            last_name: last_name,
            email: email
        });
    }
});
