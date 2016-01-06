(function() {
    'use strict';

    angular.module('app', [
        'ngMessages',
        'ui.validate',
        'ui.router',
        'angular-jwt',
        'angular-storage',
        'smart-table',
        'app.directives',
        'app.services',
        'app.home',
        'app.login',
        'app.signup',
        'app.account',
        'app.account.billing',
        'app.projects',
        'app.projects.overview',
        'app.projects.budget',
        'app.projects.funds',
        'app.projects.expenditures',
        'app.projects.subcontractors',
        'app.tutorial'
    ]);
})();
