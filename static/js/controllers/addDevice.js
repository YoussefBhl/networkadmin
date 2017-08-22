function addDevice($rootScope, $scope, $uibModalInstance, $http, $timeout, switchsFactory) {
    // (there is input form just for siwtch so we need to verfy if we the user adding a switch or camer)
    $scope.isSwitch = false;
    $scope.device = "Device";
    $scope.typeList =  ["camera","router","other"];
    $scope.type = "other";
    addBaseCtrl.call(this, $scope, $http, $rootScope, $uibModalInstance, $timeout);
    var self = this;
    var radios = document.getElementsByName('optradio');
    $scope.ok = function () {
        if (this.checkIp($scope.Ip)) {
                data = {
                    name: $scope.name,
                    ip: $scope.Ip,
                    type:$scope.type,
                    tableName: "devices"
                }
                this.addDevice('http://127.0.0.1:5000/addDevice', data, "Device Added")
        }


    };
    //if cancel btn clicked we close the window
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');

    };


}
addSwitch.prototype = Object.create(addBaseCtrl.prototype);
angular
    .module('inspinia')
    .controller('addDevice', addDevice)