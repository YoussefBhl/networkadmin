function loginCtrl($http, $scope, Auth) {
    $scope.callData = function ($event) {

        //checking the username and password
        $http({
                method: 'POST',
                url: 'http://127.0.0.1:5000/AuthenticateUser',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                data: {
                    username: $scope.username,
                    password: $scope.password
                }
            })
            .then(function (resp) {
                if (resp.data) {
                    Auth.setUser(resp.data);   
                }
                else
                {
                    document.getElementById("errorMsg").style.display = "block";
                }
            }, function (error) {
                alert("Cannot connect to server");
            });
    }
};

angular
    .module('inspinia')
    .controller('loginCtrl', loginCtrl)