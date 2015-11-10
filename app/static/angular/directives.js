// Directives of this Angular app
var app = angular.module('app.directives', []);

// DIRECTIVE: username-availability
// Checks if an username is available
app.directive('usernameAvailability', function($q, UserService) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            ctrl.$asyncValidators.usernameAvailability = function(username) {
                return UserService.getUserbyUsername(username).then(function(response) {
                    if (response.data.num_results == 0) {
                        ctrl.$setValidity('usernameAvailability', true);
                    } else {
                        ctrl.$setValidity('usernameAvailability', false);
                        return $q.reject(response);
                    }
                }, function(response) {
                    ctrl.$setValidity('usernameAvailability', false);
                    return $q.reject(response);
                });
            }
        }
    }
});

// DIRECTIVE: email-availability
// Checks if an email already exists
app.directive('emailAvailability', function($q, UserService) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            ctrl.$asyncValidators.emailAvailability = function(email) {
                return UserService.getUserbyEmail(email).then(function(response) {
                    if (response.data.num_results == 0) {
                        ctrl.$setValidity('emailAvailability', true);
                    } else {
                        ctrl.$setValidity('emailAvailability', false);
                        return $q.reject(response);
                    }
                }, function(response) {
                    ctrl.$setValidity('emailAvailability', false);
                    return $q.reject(response);
                });
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
