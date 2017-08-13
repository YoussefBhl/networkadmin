function cameraCtrl($scope, cameraFactory, $location, $state, $uibModal, $http) {
    /*$scope.switchsList = switchsFactory;*/
    $scope.device = "Camera"
    $scope.btn = "show";
    listeBaseCtrl.call(this, $scope, $uibModal, $state, $http);
    var self = this;
    $scope.devicesList = [];
    //get switch list 
    var handleSuccess = function (data, status) {
        $scope.devicesList = data;
    };
    cameraFactory.get().success(handleSuccess);
    $scope.goToDeviceDetail = function (selectedDevice) {
        
    }
    $scope.goToDeviceConf = function (selectedDevice) {
        this.goToDeviceURL('home.cameraConf', selectedDevice)
    }
    //open pop up when user want to add new switch
    $scope.addDevice = function () {
        this.newDevice('views/addDevice.html', 'addCamera')
    }
    //when user add new switch we refresh list
    $scope.$on("Camera Added", function (pevent, padata) {
        cameraFactory.get().success(handleSuccess);
    })

    $scope.delete = function (id) {
        data = {
                        id: id,
                        tableName:"camera"
                    }
        this.deleteDevice(cameraFactory,handleSuccess,data);
    }
    $scope.showMore = function(){
        $scope.show = !$scope.show;
        if($scope.show == true)
            $scope.btn = "hide";
        else
            $scope.btn = "show";
    }
}
switchsCtrl.prototype = Object.create(listeBaseCtrl.prototype);
angular
    .module('myApp')
    .controller('cameraCtrl', cameraCtrl)