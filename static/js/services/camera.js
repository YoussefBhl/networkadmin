function cameraFactory($filter, $http, $q) {
    var deferred = $q.defer();
    return {
        get: function () {
            return $http({method: 'GET', 
            url: 'http://127.0.0.1:5000/cameraList'})
        }

    }

}
angular
    .module('myApp')
    .factory('cameraFactory', cameraFactory)