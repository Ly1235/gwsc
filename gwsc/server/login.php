<?php
include "config.php";
if($_SERVER["REQUEST_METHOD"]=="POST"){
    if(isset($_POST["utel"])&&isset($_POST["upwd"])){
          $utel = $_POST["utel"];
          $upwd = $_POST["upwd"];


         //sql语句
        $sql="SELECT uid,utel FROM users WHERE utel='".$utel."' AND upwd='".$upwd."'";

        //执行sql语句
        $result = $conn->query($sql);

        if($result->num_rows>=1){
           // $data=$result->fetch_assoc();
            print_r(json_encode(array("msg"=>"登录成功","status"=>"1","data"=>$result->fetch_assoc())));
        }else{
            print_r(json_encode(array("msg"=>"用户名或密码错误","status"=>"0")));
        }
        $conn->close();
    }else{
        print_r(json_encode(array("msg"=>"数据不合法","status"=>"-2")));
    }
}else{
    print_r(json_encode(array("msg"=>"不支持该请求方式","status"=>"-1")));
}