function switchsCtrl ($scope,switchsFactory, $location, $state) {
  /*$scope.switchsList = switchsFactory;
  console.log($scope.switchsList)*/
  switchsFactory.then(function (switchs) {
      $scope.switchsList = switchs;
      console.log($scope.switchsList)
  })
  
   $scope.goToSwitchDetail = function (index) {
        $state.go('home.switchDetail', {
            selectedSwitch: index
        });
    }
  
}
angular
    .module('myApp')
    .controller('switchsCtrl', switchsCtrl)
    