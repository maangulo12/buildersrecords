angular.module('app.services', [

])
.service('authService', function($http) {
    this.authenticate = function(login, password) {
        return $http.post('/auth', {
            username: login,
            password: password
        });
    }
})
.service('mailService', function($http) {
    this.sendRegistrationEmail = function(email, first_name, last_name, username) {
        return $http.post('/send_registration_email', {
            email: email,
            first_name: first_name,
            last_name: last_name,
            username: username
        });
    }
})
.service('usersService', function($http) {
    this.getUsersInfoByUsername = function(username) {
        return $http.get('/api/users?q={"filters":[{"name":"username","op":"equals","val":"' + username + '"}]}');
    }
    this.getUsersInfoByEmail = function(email) {
        return $http.get('/api/users?q={"filters":[{"name":"email","op":"equals","val":"' + email + '"}]}');
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
})
.service('projectsService', function($http) {
    this.getAllProjects = function(user_id) {
        return $http.get('/api/projects?q={"filters":[{"name":"user_id","op":"equals","val":"' + user_id + '"}]}');
    }
});
