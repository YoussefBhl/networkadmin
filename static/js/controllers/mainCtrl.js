function mainCtrl($scope, Auth, $location) {

  $scope.$watch(Auth.isLoggedIn, function (value, oldValue) {

    if (!value && oldValue) {
      console.log("Disconnect");
      $location.path('/login');
    }

    if (value) {
      console.log("Connect");
      $location.path('/home');
      //Do something when the user is connected
    }

  }, true);
}
angular
  .module('myApp')
  .controller('mainCtrl', mainCtrl)
  .directive('restrict', function (Auth) {
    return {
      restrict: 'A',
      prioriry: 100000,
      scope: false,
      link: function () {
        // alert('ergo sum!');
      },
      compile: function (element, attr, linker) {
        var accessDenied = true;
        var userRole = Auth.getUserRole();

        var attributes = attr.access.split(" ");
        for (var i in attributes) {
          if (userRole == attributes[i]) {
            accessDenied = false;
          }
        }


        if (accessDenied) {
          element.children().remove();
          element.remove();
        }

      }
    }
  });