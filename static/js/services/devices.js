function devicesFactory($filter, $http, $q) {
    var deferred = $q.defer();
    return {
        getCamera: function (data) {
            return $http({method: 'GET', 
            url: 'http://127.0.0.1:5000/cameraList'})
    },
    getRouter: function (data) {
            return $http({method: 'GET', 
            url: 'http://127.0.0.1:5000/routerList'})
    },
    getOther: function (data) {
            return $http({method: 'GET', 
            url: 'http://127.0.0.1:5000/otherList'})
    },
    get: function (data) {
            return $http({method: 'GET', 
            url: 'http://127.0.0.1:5000/devicesList'})
        }

    }

}
angular
    .module('inspinia')
    .factory('devicesFactory', devicesFactory)