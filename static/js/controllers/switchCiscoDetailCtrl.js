function switchCiscoDetailCtrl($scope, $stateParams, switchsFactory, $http, $timeout) {
    //$scope.switchName = $stateParams.selectedSwitch;


    switchDetailBase.call(this, $scope, $http);
    var self = this;
    $scope.switch = $stateParams.selectedDevice; //we get the selected switch
    var switchModel = $scope.switch[5]
    $scope.onload = true;
    //if cisco selected we show cisco conf page
    var switchId = $stateParams.selectedDeviceID;
    var switchName = $scope.switch[1]; //switch's name

    //variable need it to get connected vlans inter and show graph

    $scope.vlansTitle = []
    $scope.interfacesTitle = []
    $scope.arpTitle = []
    $scope.ipIntTitle = []
    $scope.arp = []
    $scope.ipInt = []
    $scope.version = []
    $scope.versionTitle = []
    var mem = []
    var container;
    var buff;


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
                url: 'http://127.0.0.1:5000/selectedCisco',
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
                    var vlans = resp.data['vlans'];
                    var interfaces = resp.data['interfaces'];
                    var arp = resp.data['arp'];
                    var ip_int = resp.data['ip_int'];
                    var cpu = resp.data['cpu'];
                    mem = resp.data['mem'];
                    buff = resp.data['buff'];
                    $scope.memTot = mem[0].TOTAL;
                    $scope.version = resp.data['version'];
                    var connectedVlans = [],
                        connectedInter = []
                    for (i in vlans) {
                        if (vlans[i].STATUS == 'active') {
                            connectedVlans.push(vlans[i]);
                        }
                    }
                    for (i in interfaces) {
                        if (interfaces[i].STATUS == 'connected') {
                            connectedInter.push(interfaces[i]);
                        }
                    }
                    for (i in arp) {
                        $scope.arp.push(arp[i]);
                    }
                    for (i in ip_int) {
                        if (ip_int[i].STATUS == 'up') {
                            $scope.ipInt.push(ip_int[i]);
                        }
                        
                    }
                    for (i in vlans[0]) {
                        $scope.vlansTitle.push(i);
                    }
                    for (i in connectedInter[0]) {
                        $scope.interfacesTitle.push(i);
                    }
                    for (i in arp[0]) {
                        $scope.arpTitle.push(i);
                    }
                    for (i in ip_int[0]) {
                        $scope.ipIntTitle.push(i);
                    }
                    for (i in $scope.version[0]) {
                        $scope.versionTitle.push(i);
                    }
                    $scope.vlans = connectedVlans;
                    $scope.interfaces = connectedInter;
                    $scope.interfacesGraph(connectedInter, switchName,"VLAN","VLAN");
                    $scope.ciscoChatCPU(cpu);
                    $scope.MemChart(mem[0]['FREE'], parseInt(mem[0]['USED']));
                    $scope.BuffCiscoChart(buff[0]['FREE'], buff[0]['CREATED'],buff[0]['HITS'],buff[0]['MISSES']);
                }
            })
    }



    $scope.refresh = function () {
        //when refresh clicked we need to change the variables to empty (to make sure the results changes
        //and doesn't deplecate)
        $scope.interfacesTitle = []
        $scope.interfaces = []
        $scope.vlansTitle = []
        $scope.vlans = []
        $scope.arpTitle = []
        $scope.ipIntTitle = []
        $scope.arp = []
        $scope.ipInt = []
        $scope.version = []
        $scope.versionTitle = []
        buff = []
        $scope.onload = true;
        mem = []
        $scope.memTot = 0;
        $scope.dataMem = [];
        $scope.dataBuffers = [];
        $scope.dataCPU = []

        
        edges = []
        nodes = [];
        loadPage();
    }

}
switchCiscoDetailCtrl.prototype = Object.create(switchDetailBase.prototype);
angular
    .module('inspinia')
    .controller('switchCiscoDetailCtrl', switchCiscoDetailCtrl)