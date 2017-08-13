function config($stateProvider,$interpolateProvider, $urlRouterProvider,$locationProvider) {
    // Register the authentication interceptor
    // $httpProvider.interceptors.push('httpInterceptorFactory');

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'views/common/content.html',
            controller: 'homeCtrl'
  })
        .state('signin',{
            url: '/signin',
            templateUrl: 'views/signin.html',
            controller: 'signinCtrl',
        })
        .state('home.switchs',{
            url: '/switchs',
            templateUrl: 'views/devices.html',
            controller: 'switchsCtrl',
        })
        .state('home.camera',{
            url: '/camera',
            templateUrl: 'views/devices.html',
            controller: 'cameraCtrl',
        })
        .state('home.settings',{
            url: '/settings',
            templateUrl: 'views/settings.html',
            controller: 'settingsCtrl',
        })
        .state('home.DeleteAddUser',{
            url: '/DeleteAddUser',
            templateUrl: 'views/DeleteAddUser.html',
            controller: 'DeleteAddUserCtrl',
        })
        .state('home.switchDetail', {
            url: '/switchDetail/:selectedDeviceID',
            templateUrl: 'views/switchDetail.html',
            controller: 'switchDetailCtrl',
            params: {
                selectedDeviceID: null,
                selectedDevice:""
            }
        })
        .state('home.switchConf', {
            url: '/switchConf/:selectedDeviceID',
            templateUrl: 'views/deviceConf.html',
            controller: 'switchConfCtrl',
            params: {
                selectedDeviceID: null,
                selectedDevice:""
            }
        })
        .state('home.cameraConf', {
            url: '/cameraConf/:selectedDeviceID',
            templateUrl: 'views/deviceConf.html',
            controller: 'switchConfCtrl',
            params: {
                selectedDeviceID: null,
                selectedDevice:""
            }
        })

        $urlRouterProvider.otherwise('signin');
     $interpolateProvider.startSymbol('//').endSymbol('//');

}

angular
    .module('myApp')
    .config(config)
    .run(function ($rootScope, $location, Auth) {
    $rootScope.$on('$stateChangeStart', function (event, next, current) {

        if (!Auth.isLoggedIn()) {
            //event.preventDefault();
            $location.path('/signin');
        }
        else {  
            $location.path('/home/switchs');
        }
    });
});