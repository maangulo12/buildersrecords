var app = angular.module('app.services', []);

function query(name, op, val) {
    return '?q={"filters":[{"name":"' + name + '","op":"' + op + '","val":"' + val + '"}]}';
}

/*
    Functions for User service:
*/
app.service('User', function($http, store) {
    var url_prefix = '/api/users';
    // GET /api/users/<id>
    this.retrieve = function() {
        return $http.get(url_prefix + '/' + store.get('user').id);
    }
    // PUT /api/users/<id>
    this.update = function(form) {
        return $http.put(url_prefix + '/' + store.get('user').id, {
            email:    form.email,
            username: form.username
        });
    }
    // PUT User password /api/users/<id>
    this.updatePassword = function(password) {
        return $http.put(url_prefix + '/' + store.get('user').id, {
            password: password
        });
    }
});

// Functions for /api/projects
app.service('ProjectService', function($http, store) {
    // API: Projects entry point
    var api_entry = '/api/projects';
    // GET list of Projects
    this.getProjects = function() {
        return $http.get(api_entry + query('user_id', 'equals', store.get('user').id));
    }
    // POST Project
    this.addProject = function(form) {
        return $http.post(api_entry, {
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
        return $http.put(api_entry + '/' + store.get('project').id, {
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
        return $http.delete(api_entry + '/' + store.get('project').id);
    }
});

// Functions for /api/categories
app.service('CategoryService', function($http, store) {
    // API: Categories entry point
    var api_entry = '/api/categories';
    // GET list of Categories
    this.getCategories = function() {
        return $http.get(api_entry + query('project_id', 'equals', store.get('project').id));
    }
    // POST Category
    this.addCategory = function(category_name) {
        return $http.post(api_entry, {
            name:       category_name,
            project_id: store.get('project').id
        });
    }
    // PUT Category
    this.updateCategory = function(category_name) {
        return $http.put(api_entry + '/' + store.get('category').id, {
            name:       category_name,
            project_id: store.get('project').id
        });
    }
    // DELETE Category
    this.deleteCategory = function() {
        return $http.delete(api_entry + '/' + store.get('category').id);
    }
});

// Functions for /api/items
app.service('ItemService', function($http, store) {
    // API: Items entry point
    var api_entry = '/api/items';
    // GET list of Items
    this.getItems = function() {
        return $http.get(api_entry + query('project_id', 'equals', store.get('project').id));
    }
    // GET list of Items by Category
    this.getItemsByCategory = function() {
        return $http.get(api_entry + query('category_id', 'equals', store.get('category').id));
    }
    // POST Item
    this.addItem = function(form) {
        return $http.post(api_entry, {
            name:        form.name,
            description: form.description,
            estimated:   form.estimated,
            actual:      form.actual,
            category_id: form.category,
            project_id:  store.get('project').id
        });
    }
    // PUT Item
    this.updateItem = function(form) {
        return $http.put(api_entry + '/' + store.get('item').id, {
            name:        form.name,
            description: form.description,
            estimated:   form.estimated,
            actual:      form.actual,
            category_id: form.category.id,
            project_id:  store.get('project').id
        });
    }
    // DELETE Item
    this.deleteItem = function(item_id) {
        return $http.delete(api_entry + '/' + item_id);
    }
    // DELETE BULK Items
    this.deleteBulkItems = function() {
        return $http.delete(api_entry + query('category_id', 'equals', store.get('category').id));
    }
});

// Functions for /api/funds
app.service('FundService', function($http, store) {
    // API: Funds entry point
    var api_entry = '/api/funds';
    // GET list of Funds
    this.getFunds = function() {
        return $http.get(api_entry + query('project_id', 'equals', store.get('project').id));
    }
    // POST Fund
    this.addFund = function(form) {
        return $http.post(api_entry, {
            name:       form.name,
            loan:       form.loan,
            amount:     form.amount,
            project_id: store.get('project').id
        });
    }
    // PUT Fund
    this.updateFund = function(form) {
        return $http.put(api_entry + '/' + store.get('fund').id, {
            name:       form.name,
            loan:       form.loan,
            amount:     form.amount,
            project_id: store.get('project').id
        });
    }
    // DELETE Fund
    this.deleteFund = function() {
        return $http.delete(api_entry + '/' + store.get('fund').id);
    }
});

// Functions for /api/draws
app.service('DrawService', function($http, store) {
    // API: Draws entry point
    var api_entry = '/api/draws';
    // POST Draw
    this.addDraw = function(form) {
        return $http.post(api_entry, {
            date:    form.date,
            amount:  form.amount,
            fund_id: store.get('fund').id
        });
    }
    // PUT Draw
    this.updateDraw = function(form) {
        return $http.put(api_entry + '/' + store.get('draw').id, {
            date:    form.date,
            amount:  form.amount,
            fund_id: store.get('fund').id
        });
    }
    // DELETE Draw
    this.deleteDraw = function(draw_id) {
        return $http.delete(api_entry + '/' + draw_id);
    }
    // DELETE BULK Draws
    this.deleteBulkDraws = function() {
        return $http.delete(api_entry + query('fund_id', 'equals', store.get('fund').id));
    }
});

// Functions for /api/expenditures
app.service('ExpenditureService', function($http, store, $filter) {
    // API: Expenditures entry point
    var api_entry = '/api/expenditures';
    // GET list of Expenditures
    this.getExpenditures = function() {
        return $http.get(api_entry + query('project_id', 'equals', store.get('project').id));
    }
    // GET list of Expenditures by Category
    this.getExpendituresByCategory = function() {
        return $http.get(api_entry + query('category_id', 'equals', store.get('category').id));
    }
    // POST Expenditure
    this.addExpenditure = function(form) {
        return $http.post(api_entry, {
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
        return $http.put(api_entry + '/' + store.get('expenditure').id, {
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
        return $http.delete(api_entry + '/' + expenditure_id);
    }
    // DELETE BULK Expenditures
    this.deleteBulkExpenditures = function() {
        return $http.delete(api_entry + query('category_id', 'equals', store.get('category').id));
    }
});

// Functions for /api/subcontractors
app.service('SubcontractorService', function($http, store) {
    // API: Subcontractors entry point
    var api_entry = '/api/subcontractors';
    // GET list of Subcontractors
    this.getSubcontractors = function() {
        return $http.get(api_entry + query('project_id', 'equals', store.get('project').id));
    }
    // POST Subcontractor
    this.addSubcontractor = function(form) {
        return $http.post(api_entry, {
            name:           form.name,
            company:        form.company,
            contact_number: form.contact_number,
            project_id:     store.get('project').id
        });
    }
    // PUT Subcontractor
    this.updateSubcontractor = function(form) {
        return $http.put(api_entry + '/' + store.get('subcontractor').id, {
            name:           form.name,
            company:        form.company,
            contact_number: form.contact_number,
            project_id:     store.get('project').id
        });
    }
    // DELETE Subcontractor
    this.deleteSubcontractor = function(subcontractor_id) {
        return $http.delete(api_entry + '/' + subcontractor_id);
    }
});
// ******************** END ********************

/*
    Functions for Auth service:
    -POST /api/auth/<email>    (checks if email already exists)
    -POST /api/auth/<username> (checks if username already exists)
    -POST /api/auth            (authenticates user)
*/
app.service('Auth', function($http) {
    var url_prefix = '/api/auth';
    // POST /api/auth/<email> (checks if email already exists)
    this.checkEmail = function(email) {
        var data = {
            email: email
        };
        return $http.post(url_prefix + '/email', data);
    }
    // POST /api/auth/<username> (checks if username already exists)
    this.checkUsername = function(username) {
        var data = {
            username: username
        };
        return $http.post(url_prefix + '/username', data);
    }
    // POST /api/auth (authenticates user)
    this.authenticate = function(form) {
        var data = {
            login:    form.username,
            password: form.password
        };
        return $http.post(url_prefix, data);
    }
});

/*
    Functions for Mail service:
    -POST /api/email/registration (sends registration email)
*/
app.service('Mail', function($http) {
    var url_prefix = '/api/email';
    // POST /api/email/registration (sends registration email)
    this.sendRegistrationEmail = function(form) {
        return $http.post(url_prefix + '/registration', {
            email:    form.email,
            username: form.username
        });
    }
});

// Functions for /api/uploads
app.service('UploadService', function($http) {
    // API: Uploads entry point
    var api_entry = '/api/uploads';
    // UPLOAD UBuildIt File
    this.uploadUbuildit = function(form) {
        return $http.post(api_entry + '/ubuildit', form, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        });
    }
});

/*
    Functions for /api/subscriptions
    -GET  /api/subscriptions/<id> (retrieves a subscription)
    -POST /api/subscriptions      (creates a subscription)
    -PUT  /api/subscriptions/<id> (updates a subscription)
*/
app.service('Subscription', function($http, store) {
    var url_prefix = '/api/subscriptions';
    // GET /api/subscriptions/<id> (retrieves a subscription)
    this.retrieve = function() {
        return $http.get(url_prefix + '/' + store.get('user').stripe_id);
    }
    // POST /api/subscriptions (creates a subscription)
    this.create = function(form, token_id) {
        var data = {
            email:    form.email,
            username: form.username,
            password: form.password,
            plan:     form.plan,
            token_id: token_id
        };
        return $http.post(url_prefix, data);
    }
    // PUT /api/subscriptions/<id> (updates a subscription)
    this.update = function(token_id) {
        var data = {
            stripe_id: store.get('user').stripe_id,
            token_id:  token_id
        };
        return $http.put(url_prefix + '/' + store.get('user').stripe_id, data);
    }
});

// *************************** UTILITY ***************************

/*
    Functions for Utility service:
    -storeToken(response) (stores a jwt and current user)
*/
app.service('Utility', function(store, jwtHelper) {
    // Stores token
    this.storeToken = function(response) {
        store.set('jwt', response.data.token);
        var tokenPayload = jwtHelper.decodeToken(response.data.token);
        var user = {
            id:           tokenPayload.user_id,
            stripe_id:    tokenPayload.stripe_id
        }
        store.set('user', user);
    }
});
