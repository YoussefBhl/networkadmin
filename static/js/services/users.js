function usersFactory($filter, $http, $q,Auth) {
    var deferred = $q.defer();
    return {
        get: function () {
            return $http({method: 'POST', 
            url: 'http://127.0.0.1:5000/usersList',
            data: {
                    id: Auth.getUserID()
                }
        })
        }

    }

}
angular
    .module('myApp')
    .factory('usersFactory', usersFactory)