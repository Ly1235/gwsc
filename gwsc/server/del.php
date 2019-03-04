<?php
include "config.php";


$query="DELETE FROM `carts` WHERE `cid`='".$_REQUEST["cid"]."'";
$result = $conn->query($query);
$conn->close();
