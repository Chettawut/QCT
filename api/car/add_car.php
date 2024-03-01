<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include '../conn.php';

if($_POST["business_car"])
$cusno = $_POST["businessno"];
else
$cusno = $_POST["cusno"];

$sql = "INSERT INTO `car`(`carno`, `cusno`,`business_car`, `province`, `brand`, `car_type`, `car_model`, `car_cc`, `front_tire`
, `back_tire`, `color`, `avg_daydistance`, `modelcode`, `car_speed`, `car_chassisno`, `car_loading`, `car_engineno`, `remark`
, `active_status`) 
VALUES ('".$_POST["carno"]."','".$cusno."','".$_POST["business_car"]."','".$_POST["province"]."','".$_POST["brand"]."'
,'".$_POST["car_type"]."','".$_POST["car_model"]."','".$_POST["car_cc"]."','".$_POST["front_tire"]."','".$_POST["back_tire"]."'
,'".$_POST["color"]."','".$_POST["avg_daydistance"]."','".$_POST["modelcode"]."','".$_POST["car_speed"]."','".$_POST["car_chassisno"]."'
,'".$_POST["car_loading"]."','".$_POST["car_engineno"]."','".$_POST["remark"]."','Y' ";
$sql .= ")";
$stmt = $conn->prepare($sql);

if ($stmt->execute()) {
    $response = ['status' => 1, 'message' => 'เพิ่ม Car สำเร็จ'];
} else {
    $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];
}
echo json_encode($response);
