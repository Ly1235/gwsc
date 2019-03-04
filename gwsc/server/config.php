<?php
header("content-type:application/json;charset=utf-8");
header("Access-Control-Allow-Origin:*");

//设置链接数据库的参数
$host="127.0.0.1";
$name = "root";
$pwd="";
$db="mbs";
$port="3306";

$conn = new mysqli($host,$name,$pwd,$db,$port);

//设置字符集编码
mysqli_query($conn,"set names utf8");