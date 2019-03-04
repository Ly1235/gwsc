"use strict";requirejs.config({baseUrl:"./js/",paths:{jquery:["lib/jquery-1.11.1.min"],"jquery.validate":["lib/jquery.validate"],"additional-methods":["lib/additional-methods"],yzm:["code"],shim:{yzm:{deps:["jquery"]}}}}),require(["jquery","jquery.validate","additional-methods","yzm"],function(e){draw(show_num),e(".change-code").on("click",function(){return draw(show_num),!1}),e("#yzm").blur(function(){check()}),e("#code").click(function(){check()}),e.validator.addMethod("checkTel",function(e,t,u){return/^1[34578]\d{9}$/.test(e)},"手机号不合法"),console.log(e("input[name=utel]").val()),e(".reg").validate({rules:{utel:{required:!0,checkTel:!0,remote:{url:"./../server/checkuser.php",type:"get",data:{utel:function(){return e("input[name=utel]").val()}}}},ucode:{required:!0},upwd:{required:!0,minlength:[6]},upwd2:{required:!0,equalTo:"#upwd"}},messages:{utel:{required:"手机号不能为空",remote:"该手机号已被注册"},ucode:{required:"验证码不能为空"},upwd:{required:"密码不能为空",minlength:"密码长度至少{0}位"},upwd2:{required:"确认密码不能为空",equalTo:"两次密码输入不一致"}},submitHandler:function(){return e("input[type='checkbox']").is(":checked")?e.ajax({url:"./../server/regist.php",type:"post",dataType:"json",data:{utel:e("input[name=utel]").val(),upwd:e("input[name=upwd]").val()}}).then(function(e){1==e.status?(alert(e.msg),location.href="login.html"):alert(e.msg)}):alert("请勾选梦芭莎协议"),!1}})});