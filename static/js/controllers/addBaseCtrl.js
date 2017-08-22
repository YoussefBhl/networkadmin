function addBaseCtrl($scope, $http, $rootScope, $uibModalInstance, $timeout) {

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
    //to add device we need to connect to server and add device to databse
    //if everything ok we close the window(uibModalInstance)
    //if there is porb we show errors

    $scope.addDevice = function (url, data, braodcast) {
        $http({
                method: 'POST',
                url: url,
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
                    document.getElementById("errorMsgPass").style.display = "none";
                    $timeout(function () {
                        $rootScope.$broadcast(braodcast);
                        $uibModalInstance.close();
                    }, 1000);
                } else {
                    document.getElementById("errorMsg").style.display = "none";
                    document.getElementById("errorMsgPass").style.display = "none";
                    document.getElementById("errorMsgDuplicate").style.display = "block";
                }

            }, function (error) {
                alert(error);
            });
    };
};