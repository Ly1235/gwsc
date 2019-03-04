<?php
include "config.php";
if(isset($_GET["utel"])){
    $utel  = $_GET["utel"];

    //4. 准备sql语句
    $sql = "SELECT*FROM users WHERE utel='" . $utel . "'";
    //5.执行sql语句
    $reuslt = $conn->query($sql);
    //6.判断结果
    if ($reuslt->num_rows>=1){
        print_r( "false");
    }else{
        print_r( "true");
    }

    //7.关闭链接
    $conn->close();

}