requirejs.config({
    baseUrl : "./js/",
    urlArgs : "va=" + (new Date()).getTime(),
    //paths 只能引入模块 使用了 define
    paths : {
        "jquery" : ["lib/jquery-1.11.1.min"],
        "jquery.validate" : ["lib/jquery.validate"],
        "additional-methods" : ["lib/additional-methods"],
        "yzm" : ["code"],
        "storageTools" : ["storageTools"],
        "jquery.cookie":["lib/jquery.cookie"],
        shim : {
            "yzm" : {
                deps : ["jquery"] // deps 对于当前的非模块的js文件是否依赖其他模块
            }
        }
    }
});
requirejs(["jquery", "storageTools","jquery.cookie","jquery.validate","additional-methods"], function($, tools){

    $(".heade .txt_2").on("click",function () {
        $(this).append("<span class='txt_bor'></span>");
        $(".heade .txt_1").find(".txt_bor").remove();
        $(".comn").css("display","block");
        $(".no_pwd").css("display","none")
        $(this).css("color","#000");
        $(".heade .txt_1").css("color"," #9f9f9f");
    })

    $(".heade .txt_1").on("click",function () {
        $(this).append("<span class='txt_bor'></span>");
        $(this).css("color","#000");
        $(".heade .txt_2").css("color"," #9f9f9f");
        $(".heade .txt_2").find(".txt_bor").remove();
        $(".comn").css("display","none")
        $(".no_pwd").css("display","block")
    });

    $(".comn form").validate({
        rules:{
            utel:{
                required:true,
            },
            upwd:{
                required:true,
            }
        },
        messages:{
            utel:{
                required:"手机号不能为空",
            },
            upwd:{
                required:"密码不能为空",
            }
        },
        submitHandler:function () {
            $.ajax({
                url:"./../server/login.php",
                type:"post",
                dataType:"json",
                data:{
                    utel:$("input[name=utel]").val(),
                    upwd:$("input[name=upwd]").val()
                }
            }).then(function (res) {
                if(res.status==1){
                    alert(res.msg);

                    tools.set("login",JSON.stringify(res.data));

                    //3. cookie里的数据,什么时候保存到数据库中去?
                    //登录的时候,把cookie里的数据保存到数据库中去;
                    //遍历cookie
                    //    //发一条 产品id,数量,价格,图片,详情

                    var ajaxList = [];
                    const cookieData = JSON.parse($.cookie("cartInfo") || '[]');
                    cookieData.forEach((el, index) =>{
                        el.uid=JSON.parse(tools.get("login")).uid;
                        ajaxList.push(
                            $.ajax({
                                url : "./../server/cart.php",
                                data:el, //解决这个数据就解决了 登录问题
                                type : "post"
                            })
                        );

                    });

                    if(cookieData.length==ajaxList.length){
                        $.cookie("cartInfo", "", {expires : -1000});
                        location = "index.html";
                    }
                    // Promise.all(ajaxList).then(function(){
                    //     $.cookie("cartInfo", "", {expires : -1000});
                    //     location = "index.html";
                    // })
                }else{
                    alert(res.msg)
                }
            });
            return false;
        }
    })
});