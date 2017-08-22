function switchConfCtrl($scope, $stateParams, switchsFactory, $timeout, $http, $state) {
    $scope.device = $stateParams.selectedDevice;
    //itial input value
    $scope.name = $scope.device[1];
    $scope.Ip = $scope.device[2];
    $scope.username = $scope.device[3];
    $scope.password = $scope.device[4];
    $scope.selectedModel =  $scope.device[5];
    $scope.msg = "Select Model :";
    $scope.isSwitch = true;
    $scope.modelList = ['cisco_ios', 'hp_procurve'];//siwtch list
    // selected by default
    var switchId = $stateParams.selectedDeviceID;
    confBaseCtrl.call(this, $scope, $http, $timeout, $state);

    $scope.ok = function ($event) {
        if (this.checkIp($scope.Ip)) {
                data = {
                    id: switchId,
                    name: $scope.name,
                    ip: $scope.Ip,
                    username: $scope.username,
                    password: $scope.password,
                    model: $scope.selectedModel,
                    tableName: "switchs"
                }
                this.changeDevice(data)
        }

    }
    /**/

    $scope.cancel = function () {
        $state.go('switchs.switchsList');
    }


}
switchConfCtrl.prototype = Object.create(confBaseCtrl.prototype);

angular
    .module('inspinia')
    .controller('switchConfCtrl', switchConfCtrl)