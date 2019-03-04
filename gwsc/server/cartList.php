<?php
include "config.php";


if(isset($_REQUEST["uid"])){
    $uid = $_REQUEST["uid"];

    $query = "SELECT * FROM `carts` WHERE`uid`='".$uid."'";
    $result = $conn->query($query);
    $arrIndex=array();
    while($row = $result->fetch_assoc())
    {
        array_push($arrIndex,$row);
    }
    print_r(json_encode($arrIndex));
}

if(isset($_REQUEST["cid"])){
    $query = "UPDATE `carts` SET `num`='".$_REQUEST["num"]."',`total`='".$_REQUEST["total"]."' WHERE`cid`='".$_REQUEST["cid"]."'";
    $result = $conn->query($query);
}

$conn->close();


