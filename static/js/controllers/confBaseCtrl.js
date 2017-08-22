function confBaseCtrl($scope, $http, $timeout, $state) {
//checking the input ip if the input can be ip(int.int.int.int) or something else
    $scope.checkIp = function (str) {
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
    };
    //verf the passords input are matched
    $scope.verfPassword = function verfPassword(pass1, pass2) {
        if (pass1 == pass2) {
            return true;
        } else
            return false;

    }
    // connect to server if device's conf changed then we back to devices list
    $scope.changeDevice = function (data) {
        $http({
                method: 'POST',
                url: 'http://127.0.0.1:5000/changeDevice',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                data: data
            })
            .then(function (resp) {
                if (!resp.data) {
                    $scope.modTrue = true;
                    document.getElementById("errorMsgDuplicate").style.display = "none";
                    document.getElementById("errorMsg").style.display = "none";
                    $timeout(function () {
                        if (data.tableName == "switchs") {
                            $state.go('switchs.switchsList');
                        }
                        else{
                            $state.go('devices.devicesList');
                        }
                    }, 1000);
                } else {
                    document.getElementById("errorMsg").style.display = "none";
                    document.getElementById("errorMsgDuplicate").style.display = "block";
                }
            }, function (error) {
                document.getElementById("errorMsg").style.display = "none";
                document.getElementById("errorMsgDuplicate").style.display = "block";
            });
    };
};