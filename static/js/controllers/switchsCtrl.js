function switchsCtrl ($scope,switchsFactory, $location, $state,$uibModal,$http) {
  /*$scope.switchsList = switchsFactory;*/
  $scope.switchsList = [];
  //get switch list 
    var handleSuccess = function(data, status) {
        $scope.switchsList = data;
    };
    switchsFactory.get().success(handleSuccess);
   $scope.goToSwitchDetail = function (selectedSwitch) {
        $state.go('home.switchDetail', {
            selectedSwitchID: selectedSwitch[0],
            selectedSwitch:selectedSwitch
        });
    }
    $scope.goToSwitchConf = function (selectedSwitch) {
        $state.go('home.switchConf', {
            selectedSwitchID: selectedSwitch[0],
            selectedSwitch: selectedSwitch
        });
    }
  //open pop up when user want to add new switch
    $scope.addSwitch = function(){
        var modalInstance = $uibModal.open({
                    templateUrl: 'views/addswitch.html',
                    controller: addSwitch,
                    scope: $scope,
                    windowClass: "animated fadeIn"
                });
    }
    //when user add new switch we refresh list
    $scope.$on("Switch Added",function(pevent,padata){
             switchsFactory.get().success(handleSuccess);
           })

    $scope.deleteSwitch = function(id){
        $http({
                    method: 'POST',
                    url: 'http://127.0.0.1:5000/deleteSwitch',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    data: {
                        id: id,
                    }
                })
                .then(function (resp) {
                    if (resp.data) {
                       switchsFactory.get().success(handleSuccess);
                    }
                }, function (error) {
                    alert(error);
                });

    }
}
angular
    .module('myApp')
    .controller('switchsCtrl', switchsCtrl)
    