
function homeCtrl($scope, $state){
  var tabClasses;
  
  function initTabs() {
    tabClasses = ["","",""];
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
    $state.go('home.switchs');
 
  };
  $scope.goToCamera = function () {
    tabClasses[0] = "";
    tabClasses[1] = "active";
    tabClasses[2] = "";
    $state.go('home.camera');
  };
  $scope.goToSettings = function () {
    tabClasses[0] = "";
    tabClasses[1] = "";
    tabClasses[2] = "active";
    $state.go('home.settings');
    
  };
}
angular
    .module('myApp')
    .controller('homeCtrl', homeCtrl)
