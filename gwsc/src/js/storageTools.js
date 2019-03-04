// 自己定义模块
define(function(require, exports, modules){
    //往外暴露
    modules.exports = {
        get : function(name){
            return sessionStorage.getItem(name);
        },
        set : function(name, value){
            sessionStorage.setItem(name, value);
        },
        isLogin : function(name){
            //登录返回true
            //没有登录就返回false

            let data = JSON.parse(this.get(name) || '{}');
            if(data.utel == undefined){
                return false;
            } else {
                return true;
            }
        }
    }
});