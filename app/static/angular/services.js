var app = angular.module('app.services', []);

function query(name, op, val) {
    return '?q={"filters":[{"name":"' + name + '","op":"' + op + '","val":"' + val + '"}]}';
}

// Functions for /api/users
app.service('UserService', function($http, store) {
    // API: Users entry point
    var api_entry = '/api/users';
    // GET User by Id
    this.getUserById = function() {
        return $http.get(api_entry + '/' + store.get('user').id);
    }
    // ADD User
    this.addUser = function(form) {
        return $http.post(api_entry, {
            username:   form.username,
            password:   form.password,
            email:      form.email
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
    // ADD Project
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
    // ADD Category
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
    // ADD Item
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
    // ADD Fund
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
    // ADD Draw
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
    // ADD Expenditure
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
    // ADD Subcontractor
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

// Functions for /api/auth
app.service('AuthService', function($http, store, jwtHelper) {
    // API: Auth entry point
    var api_entry = '/api/auth';
    // POST Email Validation
    this.checkEmail = function(email) {
        return $http.post(api_entry + '/email', {
            email: email
        });
    }
    // POST Username Validation
    this.checkUsername = function(username) {
        return $http.post(api_entry + '/username', {
            username: username
        });
    }
    // AUTH User
    this.authenticate = function(login, password) {
        return $http.post(api_entry, {
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
    var api_entry = '/api/email';
    // SEND EMAIL Registration
    this.sendRegistrationEmail = function(form) {
        return $http.post(api_entry + '/registration', {
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

// Create SubscriptionService
app.service('SubscriptionService', function($http) {
    // API: Subscription entry point
    var api_entry = '/api/subscriptions';
    // Subscription
    this.sendSubscription = function(form) {
        return $http.post(api_entry, {
            email:    form.email,
            username: form.username,
            password: form.password,
            sub_plan: form.sub_plan,
            card_name: form.card_name,
            card_number: form.card_number,
            exp_month: form.exp_month,
            exp_year: form.exp_year,
            cvc: form.cvc
        } );
    }
});
