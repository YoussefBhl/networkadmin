function addUserCtrl ($scope,$timeout, $rootScope, $state,$uibModalInstance,$http) {
 function verfPassword(pass){
        if($scope.password == pass){
            return true;
        }
        else
            return false;
        
    }
    function getRadios() {
        for (var i = 0, length = radios.length; i < length; i++) {
            if (radios[i].checked) {
                return (radios[i].value);
            }
        }
    }
    var radios = document.getElementsByName('optradio');
    $scope.ok = function () {
        if (verfPassword($scope.passwordVerif)) {
            $http({
                    method: 'POST',
                    url: 'http://127.0.0.1:5000/addUser',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    data: {
                        username: $scope.username,
                        password: $scope.password,
                        role: getRadios()
                    }
                })
                .then(function (resp) {
                    if (resp.data) {
                        document.getElementById("errorMsgDuplicate").style.display = "block";
                    }
                    else{
                        $scope.modTrue = true;
                        $timeout(function () {
                            $rootScope.$broadcast("user Added");
                             $uibModalInstance.close();
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
    .controller('addUserCtrl', addUserCtrl)
    