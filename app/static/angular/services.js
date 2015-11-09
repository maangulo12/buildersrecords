angular.module('app.services', [])

.service('UserService', function($http) {
    this.addUser = function(form) {
        return $http.post('/api/users', {
            username:   form.username,
            password:   form.password,
            first_name: form.first_name,
            last_name:  form.last_name,
            email:      form.email
        });
    }
})
.service('ProjectService', function($http, store) {
    this.getProjects = function() {
        return $http.get('/api/projects?q={"filters":[{"name":"user_id","op":"equals","val":"' + store.get('user').id + '"}]}');
    }
    this.addProject = function(form) {
        return $http.post('/api/projects', {
            name:         form.name,
            address:      form.address,
            city:         form.city,
            state:        form.state,
            zipcode:      form.zipcode,
            home_sq:      form.home_sq,
            project_type: form.type,
            user_id:      store.get('user').id
        });
    }
    this.updateProject = function(form) {
        return $http.put('/api/projects/' + store.get('project').id, {
            name:         form.name,
            address:      form.address,
            city:         form.city,
            state:        form.state,
            zipcode:      form.zipcode,
            home_sq:      form.home_sq,
            project_type: form.type,
            user_id:      store.get('user').id
        });
    }
    this.deleteProject = function() {
        return $http.delete('/api/projects/' + store.get('project').id);
    }
})
.service('CategoryService', function($http, store) {
    this.getCategories = function() {
        return $http.get('/api/categories?q={"filters":[{"name":"project_id","op":"equals","val":"' + store.get('project').id + '"}]}');
    }
    this.getNewCategoryId = function(category_name) {
        return $http.get('/api/categories?q={"filters":[{"name":"name","op":"equals","val":"' + category_name + '"}, \
                                                        {"name":"project_id","op":"equals","val":"' + store.get('project').id + '"}]}');
    }
    this.addCategory = function(category_name) {
        return $http.post('/api/categories', {
            name:       category_name,
            project_id: store.get('project').id
        });
    }
})
.service('ItemService', function($http, store) {
    this.addItem = function(form) {
        return $http.post('/api/items', {
            name:        form.name,
            description: form.description,
            estimated:   form.estimated,
            actual:      form.actual,
            notes:       form.notes,
            category_id: form.category,
            project_id:  store.get('project').id
        });
    }
    this.updateItem = function(item_id, name , description, estimated, actual, notes, category_id, project_id) {
        return $http.put('/api/items/' + item_id, {
            name:        name,
            description: description,
            estimated:   estimated,
            actual:      actual,
            notes:       notes,
            category_id: category_id,
            project_id:  project_id
        });
    }
    this.deleteItem = function(item_id) {
        return $http.delete('/api/items/' + item_id);
    }
})
.service('AuthService', function($http, store, jwtHelper) {
    this.authenticate = function(login, password) {
        return $http.post('/api/auth', {
            login:    login,
            password: password
        });
    }
    this.storeToken = function(response) {
        // Add token to jwt variable
        store.set('jwt', response.data.token);
        // Decode tokenPayload
        var tokenPayload = jwtHelper.decodeToken(response.data.token);
        var user = {
            id:       tokenPayload.user_id,
            username: tokenPayload.username
        }
        store.set('user', user);
    }
})
.service('MailService', function($http) {
    this.sendRegistrationEmail = function(form) {
        return $http.post('/api/email/registration', {
            email:      form.email,
            first_name: form.first_name,
            last_name:  form.last_name,
            username:   form.username
        });
    }
})
.service('UploadService', function($http) {
    this.uploadUbuildit = function(form) {
        return $http.post('/api/upload/ubuildit', form, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        })
    }
});
