function Auth(){
    var user;

return{
    setUser : function(aUser){
        user = aUser;
    },
    isLoggedIn : function(){
        return(user)? user : false;
    },
    getUserRole : function(){
        return user[3];
    }
  }
}
angular
    .module('myApp')
    .factory('Auth', Auth)