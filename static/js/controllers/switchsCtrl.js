function switchsCtrl ($scope,switchsFactory, $location, $state,$uibModal,$http,$rootScope) {
  /*$scope.switchsList = switchsFactory;*/
  $scope.btn = "show";
  $scope.device = "Switch"
  $scope.selected = -1;
  $scope.isSwitch = true;
  $scope.moreDetail = true;
  $scope.devicesStatus = []
  listeBaseCtrl.call(this, $scope,$uibModal,$state,$http);
    var self = this;
  $scope.devicesList = [];
 
  //get switch list 
    var handleSuccess = function(data, status) {
        $scope.devicesList = data;
        for(i in $scope.devicesList){
            //all devices still not try to connect so we show loader effect
            $scope.devicesStatus[i] = "onload";
            var s = $scope.devicesList[i];
            data= {
                    id:s,
                    tableName:"switchs",
                    index:i
                }
            
            $http({
                method: 'POST',
                url: 'http://127.0.0.1:5000/getSwitchStatus',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                data: {
                    id:s,
                    tableName:"switchs",
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
    switchsFactory.get().success(handleSuccess);
   $scope.goToDeviceDetail = function (selectedSwitch) {
       if(selectedSwitch[5]=="cisco_ios"){
            this.goToDeviceURL('switchs.switchCiscoDetail',selectedSwitch)
       }
        else{
            this.goToDeviceURL('switchs.switchHPDetail',selectedSwitch)
        }
    }
    $scope.goToDeviceConf = function (selectedSwitch) {
        this.goToDeviceURL('switchs.switchConf',selectedSwitch)
    }
  //open pop up when user want to add new switch
    $scope.addDevice = function(){
        this.newDevice('views/addSwitch.html','addSwitch')
    }
    $scope.showMore = function(ind){
        $scope.show = !$scope.show;
        $scope.selected = ind;
        if($scope.show == true)
            $scope.btn = "hide";
        else
            $scope.btn = "show";
    }
    //when user add new switch we refresh list
    $scope.$on("Switch Added",function(pevent,padata){
             switchsFactory.get().success(handleSuccess);
           })

    $scope.delete = function(id){
        data = {
                        id: id,
                        tableName:"switchs"
                    }
       this.deleteDevice(switchsFactory,handleSuccess,data);
    }
    $scope.refresh = function(){
        switchsFactory.get().success(handleSuccess);
    }
}
switchsCtrl.prototype = Object.create(listeBaseCtrl.prototype);

angular
    .module('inspinia')
    .controller('switchsCtrl', switchsCtrl)
    