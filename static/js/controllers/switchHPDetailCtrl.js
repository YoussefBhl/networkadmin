function switchHPDetailCtrl($scope, $stateParams, switchsFactory, $http, $timeout) {
    //$scope.switchName = $stateParams.selectedSwitch;
    //$scope.transceiverListLength = 3;


    switchDetailBase.call(this, $scope, $http);
    var self = this;
    $scope.switch = $stateParams.selectedDevice; //we get the selected switch
    $scope.ciscoView = false; //the switch can be cisco ro hp
    var switchModel = $scope.switch[5]
    $scope.onload = true;
    //if cisco selected we show cisco conf page
    var switchId = $stateParams.selectedDeviceID;
    var switchName = $scope.switch[1]; //switch's name

    //variable need it to get connected vlans inter and show graph

    $scope.vlansTitle = []
    $scope.arpTitle = []
    $scope.arp = []
    $scope.tech = []
    $scope.techTitle = []
    $scope.systemTitle = []
    $scope.system = []
    var container;
    //transceiver vars
    var interscNames = []


    loadPage();

    function loadPage() {
        data = {
            ip: $scope.switch[2],
            username: $scope.switch[3],
            password: $scope.switch[4],
            model: switchModel
        }
        $http({
                method: 'POST',
                url: 'http://127.0.0.1:5000/selectedHP',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                data: data
            })
            .then(function (resp) {

                $scope.onload = false; //if the server respond we show off the load logo
                //if the server return error we alert it
                if (resp.data['error']) {
                    alert(resp.data['error']);
                } else {
                    $scope.vlans = resp.data['vlans'];
                    $scope.arp = resp.data['arp'];
                    $scope.tech = resp.data['tech'];
                    var system = resp.data['system'];
                    $scope.packtsTot = system[0]['PACKETS_TOT']; 
                    $scope.memTot = system[0]['MEM_TOT'];
                    //system info lists
                    $scope.system = [system[0]['NAME'], system[0]['MAC'], system[0]['SOFTWARE_VERSION'], system[0]['ROM_VERSION'], system[0]['UPTIME']]
                    $scope.systemTitle = ['NAME', 'MAC ADD', 'SOFTWARE VERSION', 'ROM VERSION', 'UPTIME']

                    for (i in $scope.vlans[0]) {
                        $scope.vlansTitle.push(i);
                    }

                    for (i in $scope.arp[0]) {
                        $scope.arpTitle.push(i);
                    }
                    for (i in $scope.tech[0]) {
                        $scope.techTitle.push(i);
                    }
                    var mem_used = parseFloat(system[0]['MEM_TOT'].replace(',', '.')) - parseFloat(system[0]['MEM_FREE'].replace(',', '.'))
                    $scope.interfacesGraph($scope.arp, switchName, "", "IP");
                    $scope.HPChatCPU(system[0]['CPU_UTIL']);
                    $scope.pktsChart(system[0]['PACKETS_RX'], system[0]['PACKETS_TX']);
                    $scope.buffersChart(system[0]['BUFFERS_FREE'], system[0]['BUFFERS_LOWEST'], system[0]['BUFFERS_MISSED']);
                    $scope.MemChart(system[0]['MEM_FREE'].replace(',', '.'), mem_used);

                }
            })
    }



    $scope.refresh = function () {
        //when refresh clicked we need to change the variables to empty (to make sure the results changes
        //and doesn't deplecate)
        $scope.tech = []
        $scope.techTitle = []
        $scope.vlansTitle = []
        $scope.vlans = []
        $scope.arpTitle = []
        $scope.arp = []
        $scope.systemTitle = []
        $scope.system = []
        $scope.onload = true;
        $scope.dataCPU = [];
        $scope.dataPkts = []
        $scope.dataBuffers = []
        $scope.dataMem = []

        loadPage();
    }

}
switchHPDetailCtrl.prototype = Object.create(switchDetailBase.prototype);
angular
    .module('inspinia')
    .controller('switchHPDetailCtrl', switchHPDetailCtrl)