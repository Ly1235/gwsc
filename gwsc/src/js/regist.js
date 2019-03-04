requirejs.config({
    baseUrl : "./js/",
    //paths 只能引入模块 使用了 define
    paths : {
        "jquery" : ["lib/jquery-1.11.1.min"],
        "jquery.validate" : ["lib/jquery.validate"],
        "additional-methods" : ["lib/additional-methods"],
        "yzm" : ["code"],
        shim : {
            "yzm" : {
                deps : ["jquery"] // deps 对于当前的非模块的js文件是否依赖其他模块
            }
        }
    }
});


require(["jquery", "jquery.validate", "additional-methods", "yzm"], function($){

    draw(show_num);//加载验证码

    //看不清楚重新获取验证码
    $(".change-code").on('click', function () {
        draw(show_num);
        return false;
    });

    $("#yzm").blur(function () {
        check(); //数据提交前先检查验证码是否填写正确
    });
    $("#code").click(function () {
        check();
    });


    $.validator.addMethod("checkTel",function (val,el,param) {
        let reg =/^1[34578]\d{9}$/;
        return reg.test(val);
    },"手机号不合法");


    console.log($("input[name=utel]").val());

    $(".reg").validate({
        rules:{
            utel:{
                required:true,
                checkTel:true,

                remote:{
                    url:"./../server/checkuser.php",
                    type:"get",
                    data:{
                        "utel":function () {

                            return $("input[name=utel]").val();

                        }
                    }
                }
            },
            ucode:{
                required:true,
            },
            upwd:{
                required:true,
                minlength:[6]
            },
            upwd2:{
                required:true,
                equalTo:"#upwd"
            }
        } ,
        messages:{
            utel:{
                required:"手机号不能为空",
                remote:"该手机号已被注册"
            },
            ucode:{
                required:"验证码不能为空",
            },
            upwd:{
                required:"密码不能为空",
                minlength:"密码长度至少{0}位"
            },
            upwd2:{
                required:"确认密码不能为空",
                equalTo:"两次密码输入不一致"
            }
        },
        submitHandler:function(){
            if($("input[type='checkbox']").is(':checked')){

                $.ajax({
                    url:"./../server/regist.php",
                    type:"post",
                    dataType:"json",
                    data:{
                        utel:$("input[name=utel]").val(),
                        upwd:$("input[name=upwd]").val()
                    }


                }).then(function(result){
                    if (result.status==1){
                        alert(result.msg);
                        location.href="login.html"

                    }else{
                        alert(result.msg);

                    }
                })


            }else{
                alert("请勾选梦芭莎协议");
                return false;
            }


            return false;
        }
    });


});