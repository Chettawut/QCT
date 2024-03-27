<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: *");
// header("Access-Control-Allow-Methods: *");
date_default_timezone_set('Asia/Bangkok');   
    
include '../conn.php';
        
$action_datetime = date("Y-m-d H:i:s");

$strSQL = "UPDATE `business` SET `title_name`='".$_POST["title_name"]."',`business_name`='".$_POST["business_name"]."',`taxno`='".$_POST["taxno"]."',`email`='".$_POST["email"]."'
,`address`='".$_POST["address"]."',`zipcode`='".$_POST["zipcode"]."',`shipping_address`='".$_POST["shipping_address"]."',`shipping_zipcode`='".$_POST["shipping_zipcode"]."'
,`contact_person`='".$_POST["contact_person"]."',`contact_department`='".$_POST["contact_department"]."',`tel_phone`='".$_POST["tel_phone"]."',`tel_mobile`='".$_POST["tel_mobile"]."'
,`fax`='".$_POST["fax"]."',`active_status`='".$_POST["active_status"]."'
,updated_date='".$action_datetime."' ";
$strSQL .= "WHERE businessno= '" . $_POST["businessno"] . "' ";
$stmt = $conn->prepare($strSQL);

if ($stmt->execute())
    $response = ['status' => 1, 'message' => 'แก้ไข ลูกค้าบริษัท สำเร็จ'];
else
    $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];

echo json_encode($response);
