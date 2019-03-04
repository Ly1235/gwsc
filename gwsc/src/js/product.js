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

    //获取登录名

    var jsonStr =  tools.get("login");
    var userInfo = JSON.parse(jsonStr || "{}");

    if (userInfo.uid!=undefined){
        $("#lg_btn a").text("欢迎您："+userInfo.utel);
        $("#re_btn").remove()
    }else{
        $("#lg_btn a").text("登录");
        $(".content .logininfo_r").prepend("<li id='re_btn'><a href='#' >注册</a><span>|</span></li>")
    }

//获取商品信息
    $.ajax({
        url:"./../server/goodsinfo.php",
        dataType:"json"
    }).done(function (res) {

        const proId = location.search.split("=")[1];
        res.forEach((el, index) => {
            if (el.gid == proId) {
                $(".p_info h2").text(el.gName);
                $(".price .leftprice b").text(el.gPrice);
                let strhtml=``
                el.mImg.forEach((el,index)=>{
                    if(index==0){
                        strhtml+=` <li class="on"><a href="#">
                     <img src='${el}' alt="">
                     </a></li> `;
                    }else{
                        strhtml+=` <li><a href="#">
                     <img src='${el}' alt="">
                     </a></li> `;
                    }
                })

                $(".pic .pro_m").prepend(strhtml);
                let strH2=``
                el.bImg.forEach((el,index)=>{
                    if(index==0){
                        strH2+=`<img src='${el}' alt='' style='width: 1500px;height: 2027px' class="on">`;
                    }else{
                        strH2+=`<img src='${el}' alt='' style='width: 1500px;height: 2027px' >`;
                    }
                })

                $(".pic .glass").append(strH2);
                $(".jgshow").append(" <span style='font-size: 24px'>"+el.gPrice+"</span>")

                strhtml=`  <a class="collect">
                   立刻购买
               </a>
               <a class="add" data-info='${JSON.stringify(el)}'>
                   加入购物车
               </a>`;

                $(".addcart").append(strhtml);


                let strH=``;
                el.indexImg.forEach((el,index)=>{
                    if(index==0){
                        strH+=`  <li >
                             <a href="#" class="on">
                                 <img src='${el}' alt="">
                             </a>
                             </li>
                              `
                    }
                    strH+=`  <li>
                             <a href="#">
                                 <img src='${el}' alt="">
                             </a>
                             </li>
                              `
                });
                $(".thum_list_center ul").append(strH);

                strH=``;
                el.colors.forEach((el,index)=>{

                    if(index==0){
                        strH+=`
                       <p class="selected">
                       <span>
                       <img src="${el.colorImg}" alt="">
                       </span>
                       <i>${el.colorName}</i>
                       </p>
                       `;

                    }else{
                        strH+=`
                       <p >
                       <span>
                       <img src="${el.colorImg}" alt="">
                       </span>
                       <i>${el.colorName}</i>
                       </p>
                       `;
                    }

                });
                $(".color>ul>.colork").append(strH)
                strH=``;
                el.sizes.forEach((el,index)=>{
                    if(index==0){
                        strH+=`<a class="on">${el}</a>`
                    }else{
                        strH+=`<a>${el}</a>`
                    }
                })

                $(".size>ul>.txt>span").append(strH)



            }
        });
    });


    //颜色的选择
    $(".color>ul>.colork").on("click","p",function () {
        $(this).addClass("selected").siblings("p").removeClass("selected")
    });

    //尺寸的选择
    $(".size>ul>.txt>span").on("click","a",function () {
        $(this).addClass("on").siblings("a").removeClass("on")
    });

    $(".size>ul>.txt>span").on("mouseenter","a",function () {
        $(this).css("color","#E40165").siblings("a").css("color","#333")
    });

    $(".size>ul>.txt>span").on("mouseleave","a",function () {
        $(this).find("a").css("color","#333")
    });


    //加入购物车

    $(".addcart").on("click",".add",function () {

        let currentData=$(this).data("info");

        var color=$(".color .selected").find("i").text();
        var colorImg = $(".color .selected").find("span>img").attr("src");
        currentData.colors={"colorsName":color,"colorImg":colorImg};
        var size = $(".size .txt").find("a[class='on']").text();
        currentData.sizes=[size];

        currentData.num=parseInt($(".num p").find("b").text());




        if(tools.isLogin("login")){
            currentData.uid=JSON.parse(tools.get("login")).uid;
            console.log(currentData.uid);


            const indexDate={"uid":currentData.uid,"gid":currentData.gid,
                "gName":currentData.gName,"gPrice":currentData.gPrice,
                "gColor":currentData.colors.colorsName,
                "gSize":currentData.sizes[0],
                "gColorImg":currentData.colors.colorImg,
                "num":currentData.num
            }
            console.log(indexDate);
            $.ajax({
                url:"./../server/cart.php",
                data:indexDate,
                type:"post"
            }).then(function(res){
                console.log(res);

                alert(res.msg);
            })

        }else{
            // 2.如果没有登录,把数据保存到cookie中
            // 2.1 点击之后,去读所有的cookie

            const dataCookie=JSON.parse($.cookie("cartInfo")||'[]');
            //2.2 遍历cookie,如果有相同产品的cookie,就只要数据+1
            var flag=false; //默认,cookie中没有当前这条记录



            const indexDate={"gid":currentData.gid,
                "gName":currentData.gName,"gPrice":currentData.gPrice,
                "gColor":currentData.colors.colorsName,
                "gSize":currentData.sizes[0],
                "gColorImg":currentData.colors.colorImg,
                "num":currentData.num,
                "total":parseInt(currentData.gPrice)*parseInt(currentData.num)
            };

             console.log(dataCookie);
             console.log(indexDate);
            dataCookie.forEach((el,index)=>{

                if(el.gid==indexDate.gid&&el.gColor== indexDate.gColor&&el.gSize== indexDate.gSize){
                    el.num=parseInt(el.num)+parseInt($(".num p").find("b").text());
                    flag=true;//存在
                }
            });
            // console.log(flag);
            if(!flag){


                dataCookie.push( indexDate)
            }
            // 2.3 没有就把当前点击的那天记录添加 cookie(当前读取cookie,并且数量设置成=1)



            $.cookie("cartInfo",JSON.stringify(dataCookie),{expires:7});
            $(".cart_ring p").text(dataCookie.length);
            alert("添加成功")
        }
        return false;
    });


    setInterval(function () {
        if(!tools.isLogin("login")){
            const dataCookie=JSON.parse($.cookie("cartInfo")||'[]');
            $(".cart_ring p").text(dataCookie.length);

        }else{
            let datainfo={"uid":JSON.parse(tools.get("login")).uid};
            $.ajax({
                url:"./../server/cartList.php",
                data: datainfo
            }).then(function (res) {

                $(".cart_ring p").text(res.length)
            })
        }
    });





    //头部的显示分类
    var oCls = document.querySelector(".logininfo_r .cls");
    var oSort = document.querySelector(".sort");
    oCls.onmouseover=function () {
        oSort.style.display="block"
    };
    oSort.onmouseleave=function () {
        oSort.style.display="none"
    };









//放大镜效果



    $("body").on("mouseenter",".pro_m",function () {





        var oPic = $(".pic");
        var oZoom =$(this).find(".zoom");//小区域
        var oGlass= $(".glass");//大区域
        var oImg= $(".glass").find("img")//大图

        var sH = parseInt($(this).height()) / parseInt(oImg.height()) * parseInt(oGlass.height());

        var sW = parseInt($(this).width()) / parseInt(oImg.width()) * parseInt(oGlass.width());

        oZoom.css({
            width:parseInt(sW),
            height:parseInt(sH)
        });
        var oScale =$(this).width() / parseInt(oZoom.width());



        var oThum = $(".thum_list");


        oZoom.css("display", "block");
        oGlass.css("display", "block");
        var self=$(this)
        document.onmousemove=function (evt) {

            var e = evt || window.event;

            mx = e.clientX - oPic.position().left -self.position().left- parseInt(oZoom.css("width"))/ 2-80;






            my = e.clientY -oPic.position().top- self.position().top- parseInt(oZoom.css("height") )/ 2;
            if (mx <= 0) {
                mx = 0
            }
            if (mx >= (self.width() - parseInt(oZoom.css("width")))) {
                mx = self.width() -parseInt(oZoom.css("width"))
            }
            if (my <= 0) {
                my = 0
            }
            if (my >= (self.height() - parseInt(oZoom.css("height") ))+10) {
                my = self.height() - parseInt(oZoom.css("height") )+10
            }
            oZoom.css({
                left: mx,
                top: my
            });
            oImg.css({
                left: -mx * oScale - 1,
                top: -my * oScale - 1
            })
        };

    });

    $("body").on("mouseleave",".pro_m",function () {
        var oZoom =$(this).find(".zoom");//小区域

        var oGlass= $(".glass");//大区域
        document.onmousemove=null;
        oZoom.css("display", "none");
        oGlass.css("display", "none");
    });


    $(".codeshow .top").on("click",function () {
        $(".p_code").slideDown(500);
        $(".p_code .close").on("click",function () {
            $(".p_code").slideUp(500)
        })
    })



    //图片的交换
    $("body").on("mouseover",".thum_list_center li",function () {
        $(this).find("a").addClass("on").parents("li").siblings("li").find("a").removeClass("on");

        $(".pro_m").find("li").eq($(this).index()).addClass("on").siblings("li").removeClass("on");
        $(".pic .glass").find("img").eq($(this).index()).addClass("on").siblings("img").removeClass("on");

        return false;
    });





    $(".num .add").on("click",function () {
        $(".num b").html( parseInt($(".num b").html())+1)
    })

    $(".num .remove").on("click",function () {
        if( parseInt($(".num b").html())==1){
            return false;
        }else{
            $(".num b").html( parseInt($(".num b").html())-1)
        }
    })



    $(window).scroll(function () {
        if($(window).scrollTop()>=950){
            $(".goodsimp").addClass("fixtop")
            $(".goodsimp_addcart").show();
            $(".jgshow").show();
            $(".jgshow .mobilebuy").on("mouseenter",function () {
                $(".mobile_code_block").show();
                $(".mobilebuy").css("background-image","url(img/up.png)")
            })

            $(".jgshow .mobilebuy").on("mouseleave",function () {
                $(".mobile_code_block").hide();
                $(".mobilebuy").css("background-image","url(img/down.png)")
            })

        }else{
            $(".goodsimp").removeClass("fixtop");
            $(".goodsimp_addcart").hide();
            $(".jgshow").hide();
        }

    });
    $(".goodsimp>h2>a").on("click",function () {
        $(this).addClass("on").siblings("a").removeClass("on");
        $(".fcontainer .items").eq($(this).index()).addClass("on").siblings("div").removeClass("on")
        console.log($(this).index())
    })


});