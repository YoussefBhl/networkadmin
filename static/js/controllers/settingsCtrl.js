function settingsCtrl ($scope, $state,$timeout,$http,Auth) {
    var user = Auth.isLoggedIn();
    $scope.username = user[1];
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
                        document.getElementById("errorMsg").style.display = "none";
                    }
                    else{
                        document.getElementById("errorMsgDuplicate").style.display = "none";
                        document.getElementById("errorMsg").style.display = "none";
                        $scope.modTrue = true;
                        $timeout(function () {
                            $state.go('switchs.switchsList');
                    }, 1000);
                    }
                }, function (error) {
                    alert(error);
                });
        }
        else{
            document.getElementById("errorMsgDuplicate").style.display = "none";
            document.getElementById("errorMsg").style.display = "block";
        }
        

    };
}
angular
    .module('inspinia')
    .controller('settingsCtrl', settingsCtrl)