function listeBaseCtrl($scope,$uibModal,$state,$http) {
    //if the admin want to add new device we pop up a window   
    $scope.newDevice = function (temp,ctrl) {
    var modalInstance = $uibModal.open({
                    templateUrl: temp,
                    controller: ctrl,
                    scope: $scope,
                    windowClass: "animated fadeIn"
                });
  };
  //if the user want to show the device detail w cahnge route and send with it the selected device detail
  $scope.goToDeviceURL = function(url,selectedDevice){
    $state.go(url, {
            selectedDeviceID: selectedDevice[0],
            selectedDevice:selectedDevice
        });
  };
  $scope.deleteDevice = function(factory,handleSuccess,data){
    $http({
                    method: 'POST',
                    url: 'http://127.0.0.1:5000/deleteDevice',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    data: data
                })
                .then(function (resp) {
                    if (!resp.data) {
                        factory.get().success(handleSuccess);
                    }
                }, function (error) {
                    alert(error);
                });
  };
       
};

