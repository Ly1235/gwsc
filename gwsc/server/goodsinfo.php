<?php
header("content-type:application/json,charset=utf-8");
header("Access-Control-Allow-Origin:*");


if(isset($_REQUEST["gid"])){
   $gid = $_REQUEST["gid"];
  $goodsStr=file_get_contents("./data/goods.json");
   $goodsList=json_decode($goodsStr);
   for($i=0;$i<count($goodsList);$i++){
         if($goodsList[$i]->gid== $gid){
             print_r(json_encode($goodsList[$i]));
             break;
         }
   }
}else{
    $goodsStr=file_get_contents("./data/goods.json");
    print_r($goodsStr);
}