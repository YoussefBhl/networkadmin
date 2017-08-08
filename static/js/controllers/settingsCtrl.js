function settingsCtrl ($scope, $state,$timeout,$http,Auth) {
    function verfPassword(pass){
        if($scope.password == pass){
            return true;
        }
        else
            return false;
        
    }
    $scope.ok = function () {
        if (verfPassword($scope.passwordVerif)) {
            $http({
                    method: 'POST',
                    url: 'http://127.0.0.1:5000/changeUserConf',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    data: {
                        username: $scope.username,
                        password: $scope.password,
                        role: Auth.getUserRole(),
                        id: Auth.getUserID()
                    }
                })
                .then(function (resp) {
                    if (resp.data) {
                        document.getElementById("errorMsgDuplicate").style.display = "block";
                    }
                    else{
                        $scope.modTrue = true;
                        $timeout(function () {
                            $state.go('home.switchs');
                        }, 1000);
                    }
                }, function (error) {
                    alert(error);
                });
        }
        else{
            document.getElementById("errorMsg").style.display = "block";
        }
        

    };
}
angular
    .module('myApp')
    .controller('settingsCtrl', settingsCtrl)