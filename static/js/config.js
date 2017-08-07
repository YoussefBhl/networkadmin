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
            templateUrl: 'views/switchs.html',
            controller: 'switchsCtrl',
        })
        .state('home.camera',{
            url: '/camera',
            templateUrl: 'views/camera.html',
            controller: 'cameraCtrl',
        })
        .state('home.settings',{
            url: '/settings',
            templateUrl: 'views/settings.html',
            controller: 'settingsCtrl',
        })
        .state('home.addUser',{
            url: '/addUser',
            templateUrl: 'views/addUser.html',
            controller: 'addUserCtrl',
        })
        .state('home.switchDetail', {
            url: '/switchDetail/:selectedSwitchID',
            templateUrl: 'views/switchDetail.html',
            controller: 'switchDetailCtrl',
            params: {
                selectedSwitchID: null,
                selectedSwitch:""
            }
        })
        .state('home.switchConf', {
            url: '/switchConf/:selectedSwitchID',
            templateUrl: 'views/switchConf.html',
            controller: 'switchConfCtrl',
            params: {
                selectedSwitchID: null,
                selectedSwitch:null
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