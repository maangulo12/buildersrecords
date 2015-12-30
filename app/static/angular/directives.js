var app = angular.module('app.directives', []);

// DIRECTIVE: email-availability
// Checks if an email already exists
app.directive('emailAvailability', function($q, Auth) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            ctrl.$asyncValidators.emailAvailability = function(email) {
                return Auth.checkEmail(email).then(responseHandler, errorHandler);
                function responseHandler(response) {
                    ctrl.$setValidity('emailAvailability', true);
                    return response;
                }
                function errorHandler(response) {
                    ctrl.$setValidity('emailAvailability', false);
                    return $q.reject(response);
                }
            }
        }
    }
});

// DIRECTIVE: username-availability
// Checks if an username is available
app.directive('usernameAvailability', function($q, Auth) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            ctrl.$asyncValidators.usernameAvailability = function(username) {
                return Auth.checkUsername(username).then(responseHandler, errorHandler);
                function responseHandler(response) {
                    ctrl.$setValidity('usernameAvailability', true);
                    return response;
                }
                function errorHandler(response) {
                    ctrl.$setValidity('usernameAvailability', false);
                    return $q.reject(response);
                }
            }
        }
    }
});

// DIRECTIVE: format='number'
// Formats input field to allow numbers only
app.directive('format', function ($filter) {
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
});

// DIRECTIVE: page-select
// Smart-table custom pagination
app.directive('pageSelect', function() {
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
