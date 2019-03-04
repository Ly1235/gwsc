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

    var jsonStr =  tools.get("login");
    var userInfo = JSON.parse(jsonStr || "{}");

    if(!tools.isLogin("login")){
        const dataCookie=JSON.parse($.cookie("cartInfo")||'[]');
        cartInfo(dataCookie);



        $("body").on("click",".minus",function () {
            const self=$(this);
            const currentCart = sub(self);
            dataCookie.forEach((el,index)=>{
                if(el.gid==currentCart.gid&&el.gSize==currentCart.gSize&&el.gColor==currentCart.gColor){
                    el.num=currentCart.num;
                    el.total=currentCart.total;
                }
            })
            $.cookie("cartInfo",JSON.stringify(dataCookie),{expires:7});
        });

        $("body").on("click",".add",function () {
            const self=$(this);
            const currentCart = add(self);
            dataCookie.forEach((el,index)=>{
                if(el.gid==currentCart.gid&&el.gSize==currentCart.gSize&&el.gColor==currentCart.gColor){
                    el.num=currentCart.num;
                    el.total=currentCart.total;
                }
            });
            $.cookie("cartInfo",JSON.stringify(dataCookie),{expires:7});
        });

        $("body").on("click",".cz .J_del",function () {

            const currentCart=del($(this));
            let cartIndex=-1;
            dataCookie.forEach((el,index)=>{
                if(el.gid==currentCart.gid&&el.gSize==currentCart.gSize&&el.gColor==currentCart.gColor){
                    cartIndex=index;
                }
            });
            dataCookie.splice(cartIndex,1);
            $.cookie("cartInfo",JSON.stringify(dataCookie),{expires:7});
        })


    }else{
        $("#lg_btn").text(userInfo.utel);
        $("#re_btn").remove();
        $("#line").remove();

        //加载数据
        let datainfo={"uid":userInfo.uid};
        $.ajax({
            url:"./../server/cartList.php",
            data: datainfo
        }).then(function (res) {
            cartInfo(res);
            console.log(res);
        });


        //减少数量的时候

        $("body").on("click",".minus",function () {
            const self=$(this);
            const currentCart = sub(self);
            $.ajax({
                url:"./../server/cartList.php",
                data:currentCart,
                dataType:"post"
            });

        });

       //增加数量的时候
        $("body").on("click",".add",function () {
            const self=$(this);
            const currentCart = add(self);
            $.ajax({
                url:"./../server/cartList.php",
                data:currentCart,
                dataType:"post"
            });
        });

        //删除

        $("body").on("click",".cz .J_del",function () {
            const currentDate=del($(this));
            $.ajax({
                url:"./../server/del.php",
                data:currentDate,
                type:"post"
            })
        })


    }


  function del(el) {

      el.parents("dl").remove();
      const currentCart=el.parents("dl").data("info");

      var self=el;
     if(el.parents("dd").siblings("dt").find("input").prop("checked")){
         const price=self.parents("dd").siblings("dd[class='dj']").find("i").text();
         const num=self.parents("dd").siblings("dd[class='sl clearfix']").find("input").val();
         $(".zs .pics").text(parseInt( $(".zs .pics").text())-num);
         $(".howmuch").text(parseInt($(".howmuch").text())-parseInt(price)*num);
     }

      return currentCart;




  }

    //追加数据


    function cartInfo(result){
        let strHtml=``;
        result.forEach((el,index)=>{
            const total=parseInt(el.num)*parseInt(el.gPrice)

            strHtml+=`<dl class="top" data-info='${JSON.stringify(el)}'>
            <dt>
            <input   class="chkalls" name="J_checkboxs" type="checkbox">
            </dt>
            <dd class="sp">
            <span class="left">
            <a href="">
            <img src='${el.gColorImg}' width="39" height="53">
            </a>
            </span>
            <span class="right">
            <span class="spmc">
            <a href="" class="goods-link" target="_blank">${el.gName}</a>
        </span>
        <span class="zhiliao"> 品牌：所然　尺寸'${el.gSize} 颜色：<i>${el.gColor}</i> </span>
        </span>
        </dd>
        <dd class="dj">
            <p class="price">
            <span class="price-icon">￥</span><i>${el.gPrice}</i>
            </p>
            </dd>
            <dd class="sl clearfix">
            <a href="javascript:void(0)" class="J_minus minus">-</a>
            <input class="J_num num" data-warecode="180918401-M03XS" data-kitorder="0" type="text" value='${el.num}' data-qty="1">
            <a href="javascript:void(0)" class="J_add add">+</a>
            </dd>
            <dd class="jexj">
            <span class="price-icon" data-info='${total}'>￥</span><i>${total}</i>
            </dd>
            <dd class="cz">
           
            <p class="shanchu">
            <span class="J_del operation">
            移除
            </span>
            </p>
            </dd>
            </dl>`
        })
        $(".nr").append(strHtml)
    }






    //全选与全不选
    $("body").on("click","#chkall",function () {
        console.log($(this).is(':checked'));
        $(".nr .chkalls").prop("checked",$(this).is(':checked'));


        if($(this).is(':checked')){
            let num=0;
            $(".num").each((index,el)=>{
                num+=parseInt(el.value);
            });
            let price=0;
            $(".nr .jexj .price-icon").each((index,el)=>{
                price+=parseInt($(el).attr("data-info"));

            });
            $(".zs .pics").text(num+"件");
            $(".howmuch").text(price);
            $(".toSettlement").css("background","#EB0067")
        }else{
            $(".zs .pics").text("0件");
            $(".howmuch").text("0.00");
            $(".toSettlement").css("background","#D9D9D9")
        }
    });

    //选中

    $("body").on("click",".nr :checkbox",function () {

        let cbxCount= $(".nr :checkbox").length;
        //所有的checkbox的打钩的个数
        let checkedCount=$(".nr :checkbox:checked").length;
        $("#chkall").prop("checked",cbxCount==checkedCount);
        if(checkedCount>=1){
            $(".toSettlement").css("background","#EB0067")
        }else{
            $(".toSettlement").css("background","#D9D9D9")
        }

        let self=$(this);

        if($(this).prop("checked")){
            const num=parseInt(self.parents("dt").siblings("dd[class='sl clearfix']").find(".num").val());
            const price=self.parents("dt").siblings("dd[class='jexj']").find("i").text();
            $(".zs .pics").text(num+parseInt ($(".zs .pics").text()));
            $(".howmuch").text(parseInt(price)+parseInt($(".howmuch").text()));


        }else{
            const num=parseInt(self.parents("dt").siblings("dd[class='sl clearfix']").find(".num").val());
            const price=self.parents("dt").siblings("dd[class='jexj']").find("i").text();
            $(".zs .pics").text(parseInt( $(".zs .pics").text())-num);
            $(".howmuch").text(parseInt($(".howmuch").text())-parseInt(price));
        }
    });



    //修改数量


    function sub(el){
            if(el.siblings("input").val()==1){
                return false;
            }else{
                el.siblings("input").val(el.siblings("input").val()-1);
                const price=el.parents("dd").siblings("dd[class='dj']").find("i").text()
                const total=parseInt(el.siblings("input").val())*parseInt(price);
                el.parents("dd").siblings("dd[class='jexj']").find("i").text(total);
                const currentInfo=el.parents("dl").data("info");
                currentInfo.num=el.siblings("input").val();
                currentInfo.total=total;

                var self=el;
                if( el.parents("dd").siblings("dt").find("input").prop("checked")){

                    $(".zs .pics").text(parseInt( $(".zs .pics").text())-1);
                    $(".howmuch").text(parseInt($(".howmuch").text())-parseInt(self.parents("dd").siblings("dd[class='dj']").find("i").text()));
                }

                return currentInfo;

            }

    }




    function add(el){

      el.siblings("input").val(parseInt(el.siblings("input").val())+1)
        const price=el.parents("dd").siblings("dd[class='dj']").find("i").text()
        const total=parseInt(el.siblings("input").val())*parseInt(price);
        el.parents("dd").siblings("dd[class='jexj']").find("i").text(total)
        const currentInfo=el.parents("dl").data("info");
        currentInfo.num=el.siblings("input").val();
        currentInfo.total=total;
        var self=el;
        if( el.parents("dd").siblings("dt").find("input").prop("checked")){

            $(".zs .pics").text(parseInt( $(".zs .pics").text())+1);
            $(".howmuch").text(parseInt($(".howmuch").text())+parseInt(self.parents("dd").siblings("dd[class='dj']").find("i").text()));
        }
        return currentInfo;
    }







});