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


requirejs(['jquery','storageTools',"jquery.cookie"],function($,tools){

    $('.back').click(function(){
        $('html , body').animate({scrollTop: 0},500);
    });

    var jsonStr =  tools.get("login");
    var userInfo = JSON.parse(jsonStr || "{}");

//加载用户
    if (userInfo.uid!=undefined){
        $("#lg_btn a").text("欢迎您："+userInfo.utel);
        $("#re_btn").remove();
        $("#lg_btn").after("<li id='tc_btn'><a href='login.html' >退出</a><span>|</span></li>")
    }else{
        console.log($("#re_btn").html());
        $("#lg_btn a").text("登录");
        $("#tc_btn").remove();
        $(".loginbox_right ul").prepend("<li id='re_btn'><a href='regist.html' >注册</a><span>|</span></li>")
    }

//加载商品

    $.ajax({
        url:"./../server/goodsinfo.php",
        dataType:"json"
    }).done(function (res) {

        let str=``;
        res.forEach((el,index)=>{
            if(index%3==0&&index!=0){
                str+=`  <li>
                        <img src="${el.gImg}" height="520" width="385"/>
                        <span>${el.gName}</span>
                        <i>${el.gPrice}</i>
                        <a href="./product.html?id=${el.gid}">立即购买</a>
                        </li>
               `
            }else{
                str+=`  <li class="hd">
                        <img src="${el.gImg}" height="520" width="385"/>
                        <span>${el.gName}</span>
                        <i>${el.gPrice}</i>
                        <a href="./product.html?id=${el.gid}">立即购买</a>
                        </li>
               `

            }

        });

        $(".pro ul").append(str);
    })

//加载数据库有几件商品
    if(!tools.isLogin("login")){
        const dataCookie=JSON.parse($.cookie("cartInfo")||'[]');

        $(".cart_ring p").text(dataCookie.length)
    }else{
        let datainfo={"uid":JSON.parse(tools.get("login")).uid};
        $.ajax({
            url:"./../server/cartList.php",
            data: datainfo
        }).then(function (res) {

            $(".cart_ring p").text(res.length)
        })
    }

//轮播图

    function moveImg(list,index) {
        for(var i=0;i<list.length;i++){
            if(list[i].className=='opa-on'){//清除li的透明度样式
                list[i].className='';
            }
        }
        list[index].className='opa-on';
    }
    function moveIndex(list,num){//移动小圆圈
        for(var i=0;i<list.length;i++){
            if(list[i].className=='on'){//清除li的背景样式
                list[i].className='';
            }
        }
        list[num].className='on';
    }

    var imgList=document.querySelectorAll(".main_banner>ul>li");
    var oOl = document.querySelector(".main_banner ol")

    var str=``;
    for(var i=0;i<imgList.length;i++){
        str+=`<li></li>`
    }
    oOl.innerHTML=str;
    var list = document.querySelectorAll(".main_banner>ol>li");
    var index=0;
    var timer;
    for(var i=0;i<list.length;i++){//鼠标覆盖上哪个小圆圈，图片就移动到哪个小圆圈，并停止

        list[i].index=i;

        list[i].onmouseover= function () {
            var clickIndex=parseInt(this.index);
            index=clickIndex;
            moveImg(imgList,index);
            moveIndex(list,index);
            clearInterval(timer);
        };
        list[i].onmouseout= function () {//移开后继续轮播
            play();
        };
    }
    var nextMove=function(){
        index+=1;
        if(index>=5){
            index=0
        }
        moveImg(imgList,index);
        moveIndex(list,index);
    };
    var play=function(){
        timer=setInterval(function(){
            nextMove();
        },3000);
    };
    play();


 //显示分类

    $(".pro_cls>.cls li").mouseenter(function () {

        let str="img/pro_cls_pic"+ ($(this).index()+5)+".jpg";
        let str1= "img/pro_cls_pic"+($(this).siblings("li[class='flag']").index()+1)+".jpg"
        $(this).siblings("li[class='flag']").find("img").attr("src", str1);
        $(this).siblings("li[class='flag']").removeClass("flag");
        $(this).find("img").attr("src", str);

        $(this).parents(".pro_cls").find(".title li").eq($(this).index()).addClass("on").siblings("li").removeClass("on")
        $(this).parents(".pro_cls").find(".pro_cls_con li").eq($(this).index()).addClass("on").siblings("li").removeClass("on")
    });
    $(".pro_cls>.cls li").mouseleave(function () {

        let str = "img/pro_cls_pic"+ ($(this).index()+1)+".jpg";
        $(this).addClass("flag").siblings("li").removeClass("flag");
        $(this).find("img").attr("src",str);
    });
    $(".pro_cls .cls").mouseleave(function () {

        let str="img/pro_cls_pic"+ ($(this).find("li[class=flag]").index()+5)+".jpg";
        $(this).find("li[class=flag]").find("img").attr("src", str);

    })




    var index2=0;
    var innerGroup= $(".fashion ul>li");
    $(".fashion ul").prepend("<li class='first'><img src='img/fashion_pic6.jpg'/></li>");
    $(".fashion ul").find("li[class='first']").css({
        position:'absolute',
        left:-400,
        top:0
    });
    $(".fashion .left").on("click",function () {

        if (index2 == 0) {


            $(".fashion ul").animate({
                left:400,

            }, 1000, function () {

                //console.log($(".fashion ul"));


                index2=innerGroup.length - 2;

            })


        }else{
            var oFirst = $(".fashion ul").find("li[class='first']");
            // $(".fashion ul").find("li[class='first']").remove();
            index2--;
            selectPic(index2);
        }

    });



    function selectPic(num) {

        if (index2 == innerGroup.length - 2) {
            $(".fashion ul").css("left", "2000px");
            index2 %= 6;
        }else{
            $(".fashion ul").animate({
                left: -num * 400,
            }, 1000, function() {


            })
        }


    }


});