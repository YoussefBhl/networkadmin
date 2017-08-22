function mainCtrl($scope, Auth, $location) {
 $scope.logout = function () {
    Auth.setUser(null);  
  };
  
  
//watching if the user is logged in or not
  $scope.$watch(Auth.isLoggedIn, function (value, oldValue) {

    if (!value && oldValue) {
      $location.path('/login');
    }

    if (value) {
      var user = Auth.isLoggedIn();
      $location.path('/home');
      $scope.username = user[1];
      var perm = user[3];
      if(perm == 0){
        $scope.perm = "administrator";
      }
      else{
        $scope.perm = "User";
      }
      //Do something when the user is connected
    }
    

  }, true);
}
angular
  .module('inspinia')
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