function switchConfCtrl($scope, $stateParams, switchsFactory, $timeout, $http, $state) {
    $scope.switch = $stateParams.selectedDevice;
    var switchId = $stateParams.selectedDeviceID;
    confBaseCtrl.call(this, $scope, $http, $timeout, $state);

    var radios = document.getElementsByName('optradio');

    $scope.changeData = function ($event) {

        if (this.checkIp($scope.Ip)) {
            if (this.verfPassword($scope.passwordVerif, $scope.password)) {
                data = {
                    id: switchId,
                    name: $scope.name,
                    ip: $scope.Ip,
                    username: $scope.username,
                    password: $scope.password,
                    model: this.getRadios(radios),
                    tableName: "switchs"
                }
                this.changeDevice(data)
            } else {
                document.getElementById("errorMsg").style.display = "none";
                document.getElementById("errorMsgDuplicate").style.display = "none";
                document.getElementById("errorMsgPass").style.display = "block";
            }
        }

    }
    /**/

    $scope.cancel = function () {
        $state.go('home.switchs');
    }

}
switchConfCtrl.prototype = Object.create(confBaseCtrl.prototype);

angular
    .module('myApp')
    .controller('switchConfCtrl', switchConfCtrl)