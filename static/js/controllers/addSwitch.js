function addSwitch($rootScope, $scope, $uibModalInstance, $http, $timeout, switchsFactory) {
    /*$scope.switchsList = switchsFactory;
    console.log($scope.switchsList)*/
    $scope.isSwitch = true;
    $scope.device = "Switch";
    addBaseCtrl.call(this, $scope, $http, $rootScope, $uibModalInstance, $timeout);
    var self = this;
    var radios = document.getElementsByName('optradio');
    $scope.ok = function () {
        if (this.checkIp($scope.Ip)) {
            if (this.verfPassword($scope.passwordVerif, $scope.password)) {
                data = {
                    name: $scope.name,
                    ip: $scope.Ip,
                    username: $scope.username,
                    password: $scope.password,
                    model: this.getRadios(radios),
                    tableName: "switchs"
                }
                this.addDevice('http://127.0.0.1:5000/addDevice', data, "Switch Added")

            } else {
                document.getElementById("errorMsgPass").style.display = "block";
                document.getElementById("errorMsg").style.display = "none";
                document.getElementById("errorMsgDuplicate").style.display = "none";
            }
        }
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');

    };


}
addSwitch.prototype = Object.create(addBaseCtrl.prototype);
angular
    .module('myApp')
    .controller('addSwitch', addSwitch)