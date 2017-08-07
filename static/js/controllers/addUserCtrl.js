function addUserCtrl ($scope,usersFactory, $location, $state,$uibModal,$http) {
  $scope.usersList = [];
  //get switch list 
    var handleSuccess = function(data, status) {
        console.dir(data)
        $scope.usersList = data;
    };
    usersFactory.get().success(handleSuccess);
}
angular
    .module('myApp')
    .controller('addUserCtrl', addUserCtrl)
    