function DeleteAddUserCtrl ($scope,usersFactory, $location, $state,$uibModal,$http) {
  $scope.usersList = [];
  //get user list using the factory
    var handleSuccess = function(data, status) {
        $scope.usersList = data;
    };
    usersFactory.get().success(handleSuccess);
    //if new user added we refresh teh list
    $scope.$on("user Added",function(pevent,padata){
             usersFactory.get().success(handleSuccess);
           })
    //if the admin want to add new user we pop up a window       
    $scope.ok = function(){
        var modalInstance = $uibModal.open({
                    templateUrl: 'views/addUser.html',
                    controller: addUserCtrl,
                    scope: $scope,
                    windowClass: "animated fadeIn"
                });
    }

    $scope.deleteUser = function(role,id){
        $http({
                    method: 'POST',
                    url: 'http://127.0.0.1:5000/deleteUser',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    data: {
                        id: id,
                        role: role
                    }
                })
                .then(function (resp) {
                    if (!resp.data) {
                        usersFactory.get().success(handleSuccess);
                    }
                }, function (error) {
                    alert(error);
                });

    }
}
angular
    .module('inspinia')
    .controller('DeleteAddUserCtrl', DeleteAddUserCtrl)
    