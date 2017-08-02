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
        .state('home.switchDetail', {
            url: '/switchDetail/:selectedSwitch',
            templateUrl: 'views/switchDetail.html',
            controller: 'switchDetailCtrl',
            params: {
                selectedSwitch: null
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
            $location.path('/home');
        }
    });
});