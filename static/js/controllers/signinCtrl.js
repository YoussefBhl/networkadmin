function signinCtrl($http, $scope, Auth) {
    $scope.callData = function ($event) {

        //$event.preventDefault();
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
                if (resp.data.status != 100) {
                    Auth.setUser(resp.data);   
                }
                else
                {
                    document.getElementById("errorMsg").style.display = "block";
                }
            }, function (error) {
                console.log(error);
            });
    }
};

angular
    .module('myApp')
    .controller('signinCtrl', signinCtrl)