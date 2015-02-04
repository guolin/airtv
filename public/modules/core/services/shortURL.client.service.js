'use strict';

//Menu service used for managing  menus
angular.module('core').
    service('ShortURL', [ '$http',
        function($http){
            this.get = function(url){
                return $http.get('/api/short/?url='+url);
            }
        }]);
