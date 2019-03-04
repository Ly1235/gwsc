<?php
include "config.php";
if($_SERVER["REQUEST_METHOD"]=="POST"){

     $uid = $_POST["uid"];
   $gid = $_POST["gid"];
   $gName=$_POST["gName"];
   $gPrice=$_POST["gPrice"];
   $colors = $_POST["gColor"];
   $sizes = $_POST["gSize"];
   $colorImg=$_POST["gColorImg"];
   $num=$_POST["num"];


    $query="
SELECT * FROM carts WHERE `uid`='".$uid."' AND `gid`='".$gid."' AND `gSize`='".$sizes."' AND `gColor`='".$colors."'";

    $resultA = $conn->query($query);
    if ($resultA->num_rows >= 1) {

        $update="UPDATE carts SET `num`=`num`+".$num." ,`total`=`num`*gPrice WHERE `uid`='".$uid."' AND `gid`='".$gid."' AND gColor='".$colors."' AND gSize='".$sizes."'";
        $resultB = $conn->query($update);
        if ($resultB) {
            print_r(json_encode(array("msg" => "加入成功u", "status" => 1)));
        } else {
            print_r(json_encode(array("msg" => "加入失败u", "status" => -1)));
        }

    }else{
        $insert = "INSERT INTO carts(`gid`,`gName`,`gColor`,`gSize`,`num`,`uid`,`gColorImg`,`gPrice`,`total`)
VALUES('".$gid."','".$gName."','".$colors."','".$sizes."','".$num."','".$uid."','".$colorImg."','".$gPrice."',`num`*`gPrice`)

";
        $resultC = $conn->query($insert);
        if ($resultC) {
            print_r(json_encode(array("msg" => "加入成功i", "status" => 2)));
        } else {
            print_r(json_encode(array("msg" => "加入失败i", "status" => -2)));
        }

    }
    $conn->close();

}
