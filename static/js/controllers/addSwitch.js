function addSwitch ($rootScope,$scope,$uibModalInstance,$http,$timeout,switchsFactory) {
  /*$scope.switchsList = switchsFactory;
  console.log($scope.switchsList)*/
  function checkIp(str) {
        res = str.split(".");
        if (res.length != 4) {
            document.getElementById("errorMsg").style.display = "block";
            return false;
        } else {
            i = 0;
            while (i < 4) {
                if (parseInt(res[i]) >= 0 && parseInt(res[i]) <= 255) {
                    i++;
                } else {
                    break;
                }
            }
            if (i == 4) {
                return true;
            } else {
                document.getElementById("errorMsg").style.display = "block";
                return false;
            }
        }
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
        if (checkIp($scope.Ip)) {
            $http({
                    method: 'POST',
                    url: 'http://127.0.0.1:5000/addSwitch',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    data: {
                        name: $scope.name,
                        ip: $scope.Ip,
                        username: $scope.username,
                        password: $scope.password,
                        model: getRadios()
                    }
                })
                .then(function (resp) {
                    if (!resp.data) {
                        $scope.modTrue = true;
                        $timeout(function () {
                            $rootScope.$broadcast("Switch Added");
                            $uibModalInstance.close();
                        }, 1000);
                    }
                    
                }, function (error) {
                    alert(error);
                });
        }
        

    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    
    };

  
}
angular
    .module('myApp')
    .controller('addSwitch', addSwitch)
    