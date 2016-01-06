(function() {
    'use strict';

    angular
        .module('app.home')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['store'];

    function HomeController(store) {
        var vm = this;
        store.remove('jwt');
    }
})();
