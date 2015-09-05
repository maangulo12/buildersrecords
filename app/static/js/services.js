angular.module('app.services', [])

.service('authService', function($http) {
    this.authenticate = function(login, password) {
        return $http.post('/auth', {
            username: login,
            password: password
        });
    };
})

.service('usersService', function($http) {
    this.usernameExists = function(username) {
        return $http.get('/api/users?q={"filters":[{"name":"username","op":"equals","val":"' + username + '"}]}');
    };

    this.emailExists = function(email) {
        return $http.get('/api/users?q={"filters":[{"name":"email","op":"equals","val":"' + email + '"}]}');
    };

    this.addUser = function(username, password, first_name, last_name, email) {
        return $http.post('/api/users', {
            username: username,
            password: password,
            first_name: first_name,
            last_name: last_name,
            email: email
        });
    };
});
