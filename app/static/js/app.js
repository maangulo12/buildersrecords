var app = angular.module("app", []);

app.controller("AppCtrl", function() {
    var app = this;

    app.message = "I'm running Flask and AngularJS!";
});
