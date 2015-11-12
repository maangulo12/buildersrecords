var app = angular.module('app.services', []);

function query(name, op, val) {
    return '?q={"filters":[{"name":"' + name + '","op":"' + op + '","val":"' + val + '"}]}';
}

// Functions for /api/users
app.service('UserService', function($http) {
    // API: Users entry point
    var api_users = '/api/users';
    // GET User by username
    this.getUserbyUsername = function(username) {
        return $http.get(api_users + query('username', 'equals', username));
    }
    // GET User by email
    this.getUserbyEmail = function(email) {
        return $http.get(api_users + query('email', 'equals', email));
    }
    // ADD User
    this.addUser = function(form) {
        return $http.post(api_users, {
            username:   form.username,
            password:   form.password,
            first_name: form.first_name,
            last_name:  form.last_name,
            email:      form.email
        });
    }
});

// Functions for /api/projects
app.service('ProjectService', function($http, store) {
    // API: Projects entry point
    var api_projects = '/api/projects';
    // GET list of Projects
    this.getProjects = function() {
        return $http.get(api_projects + query('user_id', 'equals', store.get('user').id));
    }
    // ADD Project
    this.addProject = function(form) {
        return $http.post(api_projects, {
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
    // PUT Project
    this.updateProject = function(form) {
        return $http.put(api_projects + '/' + store.get('project').id, {
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
    // DELETE Project
    this.deleteProject = function() {
        return $http.delete(api_projects + '/' + store.get('project').id);
    }
});

// Functions for /api/categories
app.service('CategoryService', function($http, store) {
    // API: Categories entry point
    var api_categories = '/api/categories';
    // GET list of Categories
    this.getCategories = function() {
        return $http.get(api_categories + query('project_id', 'equals', store.get('project').id));
    }
    // ADD Category
    this.addCategory = function(category_name) {
        return $http.post(api_categories, {
            name:       category_name,
            project_id: store.get('project').id
        });
    }
});

// Functions for /api/items
app.service('ItemService', function($http, store) {
    // API: Items entry point
    var api_items = '/api/items';
    // GET list of Items
    this.getItems = function() {
        return $http.get(api_items + query('project_id', 'equals', store.get('project').id));
    }
    // ADD Item
    this.addItem = function(form) {
        return $http.post(api_items, {
            name:        form.name,
            description: form.description,
            estimated:   form.estimated,
            actual:      form.actual,
            notes:       form.notes,
            category_id: form.category,
            project_id:  store.get('project').id
        });
    }
    // PUT Item
    this.updateItem = function(form) {
        return $http.put(api_items + '/' + store.get('item').id, {
            name:        form.name,
            description: form.description,
            estimated:   form.estimated,
            actual:      form.actual,
            notes:       form.notes,
            category_id: form.category,
            project_id:  store.get('project').id
        });
    }
    // DELETE Item
    this.deleteItem = function(item_id) {
        return $http.delete(api_items + '/' + item_id);
    }
});

// Functions for /api/funds
app.service('FundService', function($http, store) {
    // API: Funds entry point
    var api_funds = '/api/funds';
    // GET list of Funds
    this.getFunds = function() {
        return $http.get(api_funds + query('project_id', 'equals', store.get('project').id));
    }
    // ADD Fund
    this.addFund = function(form) {
        return $http.post(api_funds, {
            name:       form.name,
            loan:       form.loan,
            amount:     form.amount,
            project_id: store.get('project').id
        });
    }
    // PUT Fund
    this.updateFund = function(form) {
        return $http.put(api_funds + '/' + store.get('fund').id, {
            name:       form.name,
            loan:       form.loan,
            amount:     form.amount,
            project_id: store.get('project').id
        });
    }
    // DELETE Fund
    this.deleteFund = function() {
        return $http.delete(api_funds + '/' + store.get('fund').id);
    }
});

// Functions for /api/draws
app.service('DrawService', function($http, store) {
    // API: Draws entry point
    var api_draws = '/api/draws';
    // ADD Draw
    this.addDraw = function(form) {
        return $http.post(api_draws, {
            date:    form.date,
            amount:  form.amount,
            fund_id: store.get('fund').id
        });
    }
    // PUT Draw
    this.updateDraw = function(form) {
        return $http.put(api_draws + '/' + store.get('draw').id, {
            date:    form.date,
            amount:  form.amount,
            fund_id: store.get('fund').id
        });
    }
    // DELETE Draw
    this.deleteDraw = function(draw_id) {
        return $http.delete(api_draws + '/' + draw_id);
    }
    // DELETE BULK Draws
    this.deleteBulkDraws = function() {
        return $http.delete(api_draws + query('fund_id', 'equals', store.get('fund').id));
    }
});

// Functions for /api/expenditures
app.service('ExpenditureService', function($http, store, $filter) {
    // API: Expenditures entry point
    var api_expenditures = '/api/expenditures';
    // GET list of Expenditures
    this.getExpenditures = function() {
        return $http.get(api_expenditures + query('project_id', 'equals', store.get('project').id));
    }
    // ADD Expenditure
    this.addExpenditure = function(form) {
        return $http.post(api_expenditures, {
            date:        $filter('date')(form.date,'yyyy-MM-dd'),
            vendor:      form.vendor,
            notes:       form.notes,
            cost:        form.cost,
            fund_id:     form.fund.id,
            category_id: form.item.category.id,
            item_id:     form.item.id,
            project_id:  store.get('project').id
        });
    }
    // PUT Expenditure
    this.updateExpenditure = function(form) {
        return $http.put(api_expenditures + '/' + store.get('expenditure').id, {
            date:        $filter('date')(form.date,'yyyy-MM-dd'),
            vendor:      form.vendor,
            notes:       form.notes,
            cost:        form.cost,
            fund_id:     form.fund.id,
            category_id: form.item.category.id,
            item_id:     form.item.id,
            project_id:  store.get('project').id
        });
    }
    // DELETE Expenditure
    this.deleteExpenditure = function(expenditure_id) {
        return $http.delete(api_expenditures + '/' + expenditure_id);
    }
});

// Functions for /api/subcontractors
app.service('SubcontractorService', function($http, store) {
    // API: Subcontractors entry point
    var api_subcontractors = '/api/subcontractors';
    // GET list of Subcontractors
    this.getSubcontractors = function() {
        return $http.get(api_subcontractors + query('project_id', 'equals', store.get('project').id));
    }
});

// Functions for /api/auth
app.service('AuthService', function($http, store, jwtHelper) {
    // API: Auth entry point
    var api_auth = '/api/auth';
    // AUTH User
    this.authenticate = function(login, password) {
        return $http.post(api_auth, {
            login:    login,
            password: password
        });
    }
    // TOKEN Storage
    this.storeToken = function(response) {
        store.set('jwt', response.data.token);
        var tokenPayload = jwtHelper.decodeToken(response.data.token);
        var user = {
            id:       tokenPayload.user_id,
            username: tokenPayload.username
        }
        store.set('user', user);
    }
});

// Functions for /api/email
app.service('MailService', function($http) {
    // API: Email entry point
    var api_email = '/api/email';
    // SEND EMAIL Registration
    this.sendRegistrationEmail = function(form) {
        return $http.post(api_email + '/registration', {
            email:      form.email,
            first_name: form.first_name,
            last_name:  form.last_name,
            username:   form.username
        });
    }
});

// Functions for /api/upload
app.service('UploadService', function($http) {
    // API: Upload entry point
    var api_upload = '/api/upload';
    // UPLOAD UBuildIt File
    this.uploadUbuildit = function(form) {
        return $http.post(api_upload + '/ubuildit', form, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        });
    }
});
