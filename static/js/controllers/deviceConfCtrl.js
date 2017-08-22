function deviceConfCtrl($scope, $stateParams, switchsFactory, $timeout, $http, $state) {
    $scope.device = $stateParams.selectedDevice;
    //itial input value
    $scope.name = $scope.device[1];
    $scope.Ip = $scope.device[2];
    $scope.type = $scope.device[3];
    $scope.typeList =  ["camera","router","other"];
    // (there is input form just for siwtch so we need to verfy if we the user editing a switch or camer)
    $scope.isSwitch = false;
    $scope.isDevice = true;
    var switchId = $stateParams.selectedDeviceID;
    confBaseCtrl.call(this, $scope, $http, $timeout, $state);
    //send request to the server to change conf (which is send it in data)
    $scope.ok = function ($event) {
        if (this.checkIp($scope.Ip)) {
                data = {
                    id: switchId,
                    name: $scope.name,
                    ip: $scope.Ip,
                    type:$scope.type,
                    tableName: "devices"
                }
                this.changeDevice(data)
            } else {
                document.getElementById("errorMsg").style.display = "none";
                document.getElementById("errorMsgDuplicate").style.display = "none";
        }

    }
    /**/

    $scope.cancel = function () {
        $state.go('devices.devicesList');
    }

}
switchConfCtrl.prototype = Object.create(confBaseCtrl.prototype);

angular
    .module('inspinia')
    .controller('deviceConfCtrl', deviceConfCtrl)