function switchsCtrl ($scope,switchsFactory, $location, $state) {
  /*$scope.switchsList = switchsFactory;
  console.log($scope.switchsList)*/
  switchsFactory.then(function (switchs) {
      $scope.switchsList = switchs;
  })
   $scope.goToSwitchDetail = function (index) {
        $state.go('home.switchDetail', {
            selectedSwitch: $scope.switchsList[index][0]
        });
    }
  
}
angular
    .module('myApp')
    .controller('switchsCtrl', switchsCtrl)
    