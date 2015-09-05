angular.module('app.directives', [
    'app.services'
])

.directive('usernameAvailability', function(usersListService, $q) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            ctrl.$asyncValidators.usernameAvailability = function(username) {

                var promise = usersListService.isUsernameUnique(username);
                var success = function(response) {
                    if (response.data.num_results == 0) {
                        ctrl.$setValidity('usernameAvailability', true);
                    } else {
                        ctrl.$setValidity('usernameAvailability', false);
                        return response;
                    }
                };
                var failure = function(response) {
                    ctrl.$setValidity('usernameAvailability', false);
                    return $q.reject(response);
                };
                return promise.then(success, failure);
            };
        }
    };
})

.directive('emailAvailability', function(usersListService, $q) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            ctrl.$asyncValidators.emailAvailability = function(email) {

                var promise = usersListService.isEmailUnique(email);
                var success = function(response) {
                    if (response.data.num_results == 0) {
                        ctrl.$setValidity('emailAvailability', true);
                    } else {
                        ctrl.$setValidity('emailAvailability', false);
                        return response;
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
