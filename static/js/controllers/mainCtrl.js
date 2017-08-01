function mainCtrl ($scope, Auth, $location) {

  $scope.$watch(Auth.isLoggedIn, function (value, oldValue) {

    if(!value && oldValue) {
      console.log("Disconnect");
      $location.path('/login');
    }

    if(value) {
      console.log("Connect");
      $location.path('/home');
      //Do something when the user is connected
    }

  }, true);
}
angular
    .module('myApp')
    .controller('mainCtrl', mainCtrl)
    