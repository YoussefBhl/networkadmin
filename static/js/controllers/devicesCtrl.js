function devicesCtrl($scope, devicesFactory, $location, $state, $uibModal, $http) {
    /*$scope.switchsList = switchsFactory;*/
    //pendingRequests.cancelAll();
    $scope.device = "Device";
    
    $scope.isDevice = true;
    $scope.moreDetail = true;
    $scope.btn = "show";
    $scope.selected = -1;
    $scope.devicesStatus = []
    listeBaseCtrl.call(this, $scope, $uibModal, $state, $http);
    var self = this;
    $scope.devicesList = [];
    //get switch list 
    var handleSuccess = function (data, status) {
        $scope.devicesList = data;
        for(i in $scope.devicesList){
            //all devices still not try to connect so we show loader effect
            $scope.devicesStatus[i] = "onload";
            var s = $scope.devicesList[i];
            var ip = $scope.devicesList[i][2];
            $http({ 
                method: 'POST',
                url: 'http://127.0.0.1:5000/getDeviceStatus',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                data: {
                    ip:ip,
                    index:i
                }
            })
            .then(function (resp) {
                if (resp.data) {
                    $scope.devicesStatus[resp.data[0]] = resp.data[1];
                }
            }, function (error) {
                console.log(error);
            });
        }
    };
    devicesFactory.get().success(handleSuccess);
    $scope.goToDeviceDetail = function (selectedDevice) {
    }
    $scope.goToDeviceConf = function (selectedDevice) {
        this.goToDeviceURL('devices.deviceConf', selectedDevice)
    }
    //open pop up when user want to add new switch
    $scope.addDevice = function () {
        this.newDevice('views/addDevice.html', 'addDevice')
    }
    //when user add new switch we refresh list
    $scope.$on("Device Added", function (pevent, padata) {
        devicesFactory.get().success(handleSuccess);
    })
    $scope.delete = function (id) {
        data = {
                        id: id,
                        tableName:"Devices"
                    }
        this.deleteDevice(devicesFactory,handleSuccess,data);
    }
    $scope.showMore = function(ind){
        $scope.show = !$scope.show;
        $scope.selected = ind;
        if($scope.show == true)
            $scope.btn = "hide";
        else
            $scope.btn = "show";
    }
    $scope.refresh = function(){
        devicesFactory.get().success(handleSuccess);
    }
}
switchsCtrl.prototype = Object.create(listeBaseCtrl.prototype);
angular
    .module('inspinia')
    .controller('devicesCtrl', devicesCtrl)