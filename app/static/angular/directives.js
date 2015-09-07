angular.module('app.directives', [
    'app.services'
])
.directive('usernameAvailability', function(usersService, $q) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            ctrl.$asyncValidators.usernameAvailability = function(username) {

                var promise = usersService.usernameExists(username);
                var success = function(response) {
                    if (response.data.num_results == 0) {
                        ctrl.$setValidity('usernameAvailability', true);
                    } else {
                        ctrl.$setValidity('usernameAvailability', false);
                        return $q.reject(response);
                    }
                }
                var failure = function(response) {
                    ctrl.$setValidity('usernameAvailability', false);
                    return $q.reject(response);
                }
                return promise.then(success, failure);
            }
        }
    }
})
.directive('emailAvailability', function(usersService, $q) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            ctrl.$asyncValidators.emailAvailability = function(email) {

                var promise = usersService.emailExists(email);
                var success = function(response) {
                    if (response.data.num_results == 0) {
                        ctrl.$setValidity('emailAvailability', true);
                    } else {
                        ctrl.$setValidity('emailAvailability', false);
                        return $q.reject(response);
                    }
                };
                var failure = function(response) {
                    ctrl.$setValidity('emailAvailability', false);
                    return $q.reject(response);
                };
                return promise.then(success, failure);
            };
        }
    };
});
