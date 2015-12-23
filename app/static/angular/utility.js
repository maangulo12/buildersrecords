var app = angular.module('app.utility', []);

app.service('UtilityService', function() {
    // Removes an alert by timeout
    this.alertTimeout = function(id, wait) {
        setTimeout(function() {
            $('#' + id).remove();
        }, wait);
    }
});
