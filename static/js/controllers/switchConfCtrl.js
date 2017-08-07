function switchConfCtrl($scope, $stateParams, switchsFactory, $timeout, $http,$state) {
    $scope.switch = $stateParams.selectedSwitch;
    var switchId = $stateParams.selectedSwitchID;

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


    $scope.changeData = function ($event) {

        if (checkIp($scope.Ip)) {
            $http({
                    method: 'POST',
                    url: 'http://127.0.0.1:5000/changeSwitch',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    data: {
                        id: switchId,
                        name: $scope.name,
                        ip: $scope.Ip,
                        username: $scope.username,
                        password: $scope.password,
                        model: getRadios()
                    }
                })
                .then(function (resp) {
                    if (resp.data) {
                        $scope.modTrue = true;
                        $timeout(function () {
                            $state.go('home.switchs');
                        }, 1000);
                    }
                }, function (error) {
                    alert(error);
                });
        }
        /**/
    }
    $scope.cancel = function(){
         $state.go('home.switchs');
    }

}

angular
    .module('myApp')
    .controller('switchConfCtrl', switchConfCtrl)