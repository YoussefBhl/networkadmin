function Auth(){
    var user;

return{
    setUser : function(aUser){
        user = aUser;
    },
    isLoggedIn : function(){
        return(user)? user : false;
    }
  }
}
angular
    .module('myApp')
    // .factory('httpInterceptorFactory', httpInterceptorFactory)
    .factory('Auth', Auth)