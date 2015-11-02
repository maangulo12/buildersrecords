// This module contains all of the directives of this Angular app.
// Directives are markers on a DOM element that tell Angular compiler
// to attach a specified behavior to that DOM element.
angular.module('app.directives', [])

.directive('usernameAvailability', function($http, $q) {
    // This directive checks if an username is available.
    // It basically goes to the backend and checks if that username already exists.
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            ctrl.$asyncValidators.usernameAvailability = function(username) {

                var promise = $http.get('/api/users?q={"filters":[{"name":"username","op":"equals","val":"' + username + '"}]}');
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
.directive('emailAvailability', function($http, $q) {
    // This directive checks if an email is available.
    // It goes to the backend and checks if that email already exists.
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            ctrl.$asyncValidators.emailAvailability = function(email) {

                var promise = $http.get('/api/users?q={"filters":[{"name":"email","op":"equals","val":"' + email + '"}]}');
                var success = function(response) {
                    if (response.data.num_results == 0) {
                        ctrl.$setValidity('emailAvailability', true);
                    } else {
                        ctrl.$setValidity('emailAvailability', false);
                        return $q.reject(response);
                    }
                }
                var failure = function(response) {
                    ctrl.$setValidity('emailAvailability', false);
                    return $q.reject(response);
                }
                return promise.then(success, failure);
            }
        }
    }
})
.directive('format', function ($filter) {
    // This directive is used for formatting input field to allow only numbers
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            if (!ctrl) {
                return;
            }
            ctrl.$formatters.unshift(function (a) {
                return $filter(attrs.format)(ctrl.$modelValue)
            });
            ctrl.$parsers.unshift(function (viewValue) {
                var plainNumber = viewValue.replace(/[^\d|\-+|\.+]/g, '');
                element.val($filter(attrs.format)(plainNumber));
                return plainNumber;
            });
        }
    }
})
.directive('pageSelect', function() {
    // This directive is used smart-table custom pagination
    return {
        restrict: 'E',
        template: '<input type="text" class="select-page" ng-model="inputPage" ng-change="selectPage(inputPage)">',
        link: function(scope, element, attrs) {
            scope.$watch('currentPage', function(c) {
                scope.inputPage = c;
            });
        }
    }
});
