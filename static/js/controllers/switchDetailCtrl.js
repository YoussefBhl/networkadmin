function switchDetailCtrl($scope, $stateParams, switchsFactory, $http) {
    //$scope.switchName = $stateParams.selectedSwitch;
    $scope.switch = $stateParams.selectedDevice;
    var switchId = $stateParams.selectedDeviceID;
    var switchName = $scope.switch[1];

    //sent to server the selected switch's ID
    var connectedVlans = []
    var vlansTitle = []
    var interfacesTitle = []
    var interfacesStatus = []
    var edges = []
    var nodes = [];
    loadPage();
    function loadPage() {
        $http({
                method: 'POST',
                url: 'http://127.0.0.1:5000/selectedSwitch',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                data: {
                    switch: $scope.switch,
                    model: $scope.switch[5]
                }
            })
            .then(function (resp) {
                vlans = resp.data['vlans'];
                interfaces = resp.data['interfaces'];
                for (i in vlans) {
                    if (vlans[i].STATUS == 'active') {
                        connectedVlans.push(vlans[i]);
                    }
                }
                $scope.vlans = connectedVlans;
                //push root switch

                var xpos = 150,
                    ypos = -70,
                    node = {};

                for (i in interfaces) {
                    interfacesStatus.push(interfaces[i]);
                    nodes.push({
                        id: parseInt(i) + 1,
                        label: "VLAN".concat(interfaces[i]['VLAN']),
                        x: xpos,
                        y: ypos,
                        physics: false
                    });
                    node = {};
                    ypos += 70;
                    edges.push({
                        from: 0,
                        to: parseInt(i) + 1,
                        label: interfaces[i]['PORT'],
                        arrows: 'to'
                    })
                }
                nodes.push({
                    id: 0,
                    label: switchName,
                    x: -100,
                    y: (-140 + ypos) / 2,
                    physics: false
                })
                var container = document.getElementById('mynetwork');
                var data = {
                    nodes: nodes,
                    edges: edges
                };
                var options = {
                    physics: true,
                    configure: false,
                    edges: {
                        smooth: {
                            type: 'continuous'
                        }
                    }
                };
                var network = new vis.Network(container, data, options);

                $scope.interfaces = interfacesStatus;
                for (i in vlans[0]) {
                    vlansTitle.push(i);
                }
                $scope.vlansTitle = vlansTitle;
                for (i in interfaces[0]) {
                    interfacesTitle.push(i);
                }
                $scope.interfacesTitle = interfacesTitle;

            }, function (error) {
                alert(error);
            });
    }



    $scope.refresh = function () {
    connectedVlans = []
    vlansTitle = []
     interfacesTitle = []
     interfacesStatus = []
     edges = []
     nodes = [];
        loadPage();
    }
}

angular
    .module('myApp')
    .controller('switchDetailCtrl', switchDetailCtrl)