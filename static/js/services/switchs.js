function switchsFactory($filter, $http, $q) {
    var deferred = $q.defer();
    $resource = $http.get('http://127.0.0.1:5000/switchsList')
        .success(function (observations) {
            return deferred.resolve(observations);
        })
        .error(function (err) {
            deferred.reject(err);
        })
    return deferred.promise;
}
angular
    .module('myApp')
    .factory('switchsFactory', switchsFactory)