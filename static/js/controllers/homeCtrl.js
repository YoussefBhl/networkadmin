
function homeCtrl($scope, $state,Auth){
  var tabClasses;
  
  function initTabs() {
    tabClasses = ["","","",""];
    tabClasses[0] = "active";
  }
  
  $scope.getTabClass = function (tabNum) {
    return tabClasses[tabNum];
  };
  
  $scope.getTabPaneClass = function (tabNum) {
    return "tab-pane " + tabClasses[tabNum];
  }
  
  $scope.setActiveTab = function (tabNum) {
    tabClasses[tabNum] = "active";
  };
  
  //Initialize 
  initTabs();
  $scope.goToSwitchs = function () {
    tabClasses[0] = "active";
    tabClasses[1] = "";
    tabClasses[2] = "";
    tabClasses[3] = "";
    $state.go('home.switchs');
 
  };
  $scope.goToCamera = function () {
    tabClasses[0] = "";
    tabClasses[1] = "active";
    tabClasses[2] = "";
    tabClasses[3] = "";
    $state.go('home.camera');
  };
  $scope.goToSettings = function () {
    tabClasses[0] = "";
    tabClasses[1] = "";
    tabClasses[2] = "active";
    tabClasses[3] = "";
    $state.go('home.settings');
    
  };
  $scope.logout = function () {
    Auth.setUser(null);
    
  };
  $scope.goAddUser = function(){
    tabClasses[0] = "";
    tabClasses[1] = "";
    tabClasses[2] = "";
    tabClasses[3] = "active";
    $state.go('home.DeleteAddUser');
  }
}
angular
    .module('myApp')
    .controller('homeCtrl', homeCtrl)
