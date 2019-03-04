<?php
include "config.php";
if($_SERVER["REQUEST_METHOD"]=="POST"){
    if(isset($_POST['utel'])&&isset($_POST['upwd'])){

        if(isset($_POST["utel"])&&isset($_POST["upwd"])){
            $utel = $_POST["utel"];
            $upwd = $_POST["upwd"];


//准备sql
            $sql = "INSERT INTO `users` (`utel`,`upwd`)  VALUES ('".$utel."','".$upwd."')";

//执行sql 并得到结果
            $result = $conn->query($sql);

            if($result==1){
                $arr = array("msg"=>"注册成功","status"=>1);
                print_r(json_encode($arr));
            }else{
                $arr = array("msg"=>"注册失败","status"=>0);
                print_r(json_encode($arr));
            }
            //7.关闭链接
            $conn->close();
    }
}
}else{
    $arr = array("msg"=>"不支持get请求方式","status"=>-1);
    print_r(json_encode($arr));
}