function switchsCtrl ($scope,switchsFactory, $location, $state,$uibModal,$http,$rootScope) {
  /*$scope.switchsList = switchsFactory;*/
  $scope.btn = "show";
  $scope.device = "Switch"
  listeBaseCtrl.call(this, $scope,$uibModal,$state,$http);
    var self = this;
  $scope.devicesList = [];
  //get switch list 
    var handleSuccess = function(data, status) {
        $scope.devicesList = data;
    };
    switchsFactory.get().success(handleSuccess);
   $scope.goToDeviceDetail = function (selectedSwitch) {
       this.goToDeviceURL('home.switchDetail',selectedSwitch)
    }
    $scope.goToDeviceConf = function (selectedSwitch) {
        this.goToDeviceURL('home.switchConf',selectedSwitch)
    }
  //open pop up when user want to add new switch
    $scope.addDevice = function(){
        this.newDevice('views/addDevice.html','addSwitch')
    }
    $scope.showMore = function(){
        $scope.show = !$scope.show;
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
}
switchsCtrl.prototype = Object.create(listeBaseCtrl.prototype);

angular
    .module('myApp')
    .controller('switchsCtrl', switchsCtrl)
    