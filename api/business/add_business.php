<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include '../conn.php';


$sql = "INSERT INTO `business`(`businessno`, `title_name`, `business_name`, `taxno`, `email`, `address`, `zipcode`
, `shipping_address`, `shipping_zipcode`, `contact_person`, `contact_department`, `tel_phone`, `tel_mobile`,
 `fax`, `active_status`) ";
$sql .= " VALUES ('".$_POST["businessno"]."','".$_POST["title_name"]."','".$_POST["business_name"]."','".$_POST["taxno"]."','".$_POST["email"]."'
,'".$_POST["address"]."','".$_POST["zipcode"]."','".$_POST["shipping_address"]."','".$_POST["shipping_zipcode"]."','".$_POST["contact_person"]."'
,'".$_POST["contact_department"]."','".$_POST["tel_phone"]."','".$_POST["tel_mobile"]."','".$_POST["fax"]."','Y' ";
$sql .= ")";
$stmt = $conn->prepare($sql);

if ($stmt->execute()) {
    $response = ['status' => 1, 'message' => 'เพิ่ม ลูกค้าบริษัท สำเร็จ'];
} else {
    $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];
}
echo json_encode($response);
