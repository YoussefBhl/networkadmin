function switchDetailCtrl($scope, $stateParams,switchsFactory,$http) {
    //$scope.switchName = $stateParams.selectedSwitch;
    var switchIndex = $stateParams.selectedSwitch;
    //sent to server the selected switch's ID
    var connectedVlans =[]
    var vlansTitle = []
    var interfacesTitle = []
    var interfacesStatus = []
    $http({
                method: 'POST',
                url: 'http://127.0.0.1:5000/selectedSwitch',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                data: {
                    ID: switchIndex
                }
            })
            .then(function (resp) {
                vlans = resp.data['vlans'];
                interfaces = resp.data['interfaces'];
                for(i in vlans){
                    if(vlans[i].STATUS == 'active'){
                        connectedVlans.push(vlans[i]);
                    }   
                }         
                $scope.vlans = connectedVlans;
                 for(i in interfaces){
                    interfacesStatus.push(interfaces[i]);
                } 
                $scope.interfaces = interfacesStatus;
                for(i in vlans[0]){
                   vlansTitle.push(i);
                }
                $scope.vlansTitle= vlansTitle;
                for(i in interfaces[0]){
                    interfacesTitle.push(i);                
                }
               $scope.interfacesTitle= interfacesTitle;
                               
            }, function (error) {
                alert(error);
            });
    switchsFactory.then(function (switchs) {
      $scope.switch = switchs[0][switchIndex-1];
  })
  //console.log(switchInfoFactory);
           
}

angular
    .module('myApp')
    .controller('switchDetailCtrl', switchDetailCtrl)