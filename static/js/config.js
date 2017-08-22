function config($stateProvider,$interpolateProvider, $urlRouterProvider,$locationProvider) {
    // Register the authentication interceptor
    // $httpProvider.interceptors.push('httpInterceptorFactory');

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'views/common/content.html',
  })
        .state('login',{
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'loginCtrl',
        })
        .state('switchs', {
            abstract: true,
            url: "/switchs",
            templateUrl: "views/common/content.html",
        })
        .state('devices',{
            abstract: true,
            url: '/devices',
            templateUrl: "views/common/content.html",
        })
        .state('switchs.switchsList',{
            url: '/switchsList',
            templateUrl: 'views/devices.html',
            controller: 'switchsCtrl',
        })
        .state('devices.camera',{
            url: '/Camera',
            templateUrl: 'views/devices.html',
            controller: 'cameraCtrl',
        })
         .state('devices.router',{
            url: '/router',
            templateUrl: 'views/devices.html',
            controller: 'routerCtrl',
        })
         .state('devices.other',{
            url: '/other',
            templateUrl: 'views/devices.html',
            controller: 'otherCtrl',
        })
        .state('devices.devicesList',{
            url: '/devicesList',
            templateUrl: 'views/devices.html',
            controller: 'devicesCtrl',
        })
        
        .state('settings',{
            url: '/settings',
            templateUrl: 'views/settings.html',
            controller: 'settingsCtrl',
        })
        .state('DeleteAddUser',{
            url: '/DeleteAddUser',
            templateUrl: 'views/DeleteAddUser.html',
            controller: 'DeleteAddUserCtrl',
        })
        .state('switchs.switchCiscoDetail', {
            url: '/CiscoDetail/:selectedDeviceID',
            templateUrl: 'views/ciscoDetail.html',
            controller: 'switchCiscoDetailCtrl',
            params: {
                selectedDeviceID: null,
                selectedDevice:""
            }
        })
        .state('switchs.switchHPDetail', {
            url: '/ProCuvre/:selectedDeviceID',
            templateUrl: 'views/hpDetail.html',
            controller: 'switchHPDetailCtrl',
            params: {
                selectedDeviceID: null,
                selectedDevice:""
            }
        })
        .state('switchs.switchConf', {
            url: '/switchConf/:selectedDeviceID',
            templateUrl: 'views/switchConf.html',
            controller: 'switchConfCtrl',
            params: {
                selectedDeviceID: null,
                selectedDevice:""
            }
        })
        .state('devices.deviceConf', {
            url: '/deviceConf/:selectedDeviceID',
            templateUrl: 'views/deviceConf.html',
            controller: 'deviceConfCtrl',
            params: {
                selectedDeviceID: null,
                selectedDevice:""
            }
        })

        $urlRouterProvider.otherwise('login');
        //change {{}} by // //
     $interpolateProvider.startSymbol('//').endSymbol('//');

}

angular
    .module('inspinia')
    .config(config)
    .run(function ($rootScope, $location, Auth) {
    $rootScope.$on('$stateChangeStart', function (event, next, current){
        
        if (!Auth.isLoggedIn()) {
            $location.path('/login');
        }
        else {  
            if($location.path() == "/home"){
                $location.path('/switchs/switchsList');
            }
        }
    });
});