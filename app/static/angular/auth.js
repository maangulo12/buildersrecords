// This module contains the authentication service functions
angular.module('app.auth', [

])
.service('authService', function(store, jwtHelper) {
    this.authHelper = function(response) {
        // Add token to jwt variable
        store.set('jwt', response.data.token);
        // Decode tokenPayload
        var tokenPayload = jwtHelper.decodeToken(response.data.token);
        // Set user_id and username
        store.set('user_id', tokenPayload.user_id);
        store.set('username', tokenPayload.username);
    }
});
