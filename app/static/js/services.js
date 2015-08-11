var services = angular.module('services', []);

services.service('UsersService', function() {
    this.method1 = function() {
        return 1;
    }

    this.method2 = function() {
        return 2;
    }
});
