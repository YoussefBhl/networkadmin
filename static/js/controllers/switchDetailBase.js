function switchDetailBase($scope, $http) {
    $scope.getCiscoDetail = function (data, switchName) {
        
    };
    $scope.getHPDetail = function(data,switchName){
        $http({
                method: 'POST',
                url: 'http://127.0.0.1:5000/selectedHP',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                data: data
            })
            .then(function (resp) {
                console.log(resp)
               
            })
    };

    $scope.interfacesGraph = function (connectedInter, switchName,str,id) {
        var nodes = [],
            edges = [];
        var xpos = 150,
            ypos = -70,
            node = {};
        for (i in connectedInter) {
            nodes.push({
                id: parseInt(i) + 1,
                label: str.concat(connectedInter[i][id]),
                x: xpos,
                y: ypos,
                physics: false
            });
            node = {};
            ypos += 70;
            edges.push({
                from: 0,
                to: parseInt(i) + 1,
                label: connectedInter[i]['PORT'],
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
        container = document.getElementById('mynetwork');
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
    };

    
    $scope.ciscoChatCPU = function (cpu){
        $scope.optionsCPU = {
            chart: {
                type: 'discreteBarChart',
                height: 250,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 50,
                    left: 55
                },
                x: function(d){return d.label;},
                y: function(d){return d.value + (1e-10);},
                showValues: true,
                valueFormat: function(d){
                    return d3.format(',f')(d);
                },
                duration: 500,
                xAxis: {
                    axisLabel: 'utilization for'
                },
                yAxis: {
                    axisLabel: 'Percent',
                    axisLabelDistance: -10,
                    tickFormat:(d3.format(',f'))
                }
            }
        };
        $scope.dataCPU = [
            {
                key: "Cumulative Return",
                values: [
                    {
                        "label" : "5 Sec" ,
                        "value" : 100
                    } ,
                    {
                        "label" : "5 Sec" ,
                        "value" : parseInt(cpu[0]['CPU_5_SEC'])
                    } ,
                    {
                        "label" : "1 Min" ,
                        "value" : 100
                    } ,
                    {
                        "label" : "1 Min" ,
                        "value" : parseInt(cpu[0]['CPU_1_MIN'])
                    } ,
                    {
                        "label" : "5 Min" ,
                        "value" : 100
                    } ,
                    {
                        "label" : "5 Min" ,
                        "value" : parseInt(cpu[0]['CPU_5_MIN'])
                    } 
                ]
            }
        ]
    }
    $scope.HPChatCPU= function (cpu){
        $scope.optionsCPU = {
            chart: {
                type: 'discreteBarChart',
                height: 250,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 50,
                    left: 55
                },
                x: function(d){return d.label;},
                y: function(d){return d.value + (1e-10);},
                showValues: true,
                valueFormat: function(d){
                    return d3.format(',f')(d);
                },
                duration: 500,
                xAxis: {
                    axisLabel: 'CPU'
                },
                yAxis: {
                    axisLabel: 'Percent',
                    axisLabelDistance: -10,
                    tickFormat:(d3.format(',f'))
                }
            }
        };
        $scope.dataCPU = [
            {
                key: "Cumulative Return",
                values: [
                    {
                        "label" : "CPU" ,
                        "value" : 100
                    },
                    {
                        "label" : "CPU" ,
                        "value" : parseInt(cpu)
                    },
                ]
            }
        ]
    };
    $scope.pktsChart = function(rx,tx){
        $scope.optionsPkts = {
            chart: {
                type: 'pieChart',
                height:350,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: false,
                duration: 500,
                valueFormat: function(d){
                    return d3.format(',f')(d);
                },
                labelThreshold: 0.01,
                labelSunbeamLayout: true,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };

        $scope.dataPkts = [
            {
                key: "RX",
                y: parseInt(rx)
            },
            {
                key: "TX",
                y: parseInt(tx)
            },
            
        ];
    };
    $scope.buffersChart = function(free,lowest,missed){
        $scope.optionsBuffers = {
            chart: {
                type: 'pieChart',
                height:350,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: false,
                duration: 500,
                valueFormat: function(d){
                    return d3.format(',f')(d);
                },
                labelThreshold: 0.01,
                labelSunbeamLayout: true,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };

        $scope.dataBuffers = [
            {
                key: "Free",
                y: parseInt(free)
            },
            {
                key: "Lowest",
                y: parseInt(lowest)
            },
            {
                key: "Missed",
                y: parseInt(missed)
            },  
            
        ];
    };
     $scope.MemChart = function(free,used){
        $scope.optionsMem = {
            chart: {
                type: 'pieChart',
                height:350,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: false,
                duration: 500,
                labelThreshold: 0.01,
                labelSunbeamLayout: true,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };

        $scope.dataMem = [
            {
                key: "FREE",
                y: parseInt(free)
            },
            {
                key: "USED",
                y: used
            },
            
        ];
    };
    $scope.BuffCiscoChart = function (free,created,hits,misses){
        $scope.optionsBuffers = {
            chart: {
                type: 'pieChart',
                height:350,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: false,
                duration: 500,
                valueFormat: function(d){
                    return d3.format(',f')(d);
                },
                labelThreshold: 0.01,
                labelSunbeamLayout: true,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };

        $scope.dataBuffers = [
            {
                key: "Free",
                y: parseInt(free)
            },
            {
                key: "CREATED",
                y: parseInt(created)
            },
            {
                key: "Missed",
                y: parseInt(misses)
            },  
            {
                key: "hits",
                y: parseInt(hits)
            }, 

        ];
    }
}