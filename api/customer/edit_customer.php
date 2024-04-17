<?php
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 1);
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: *");
// header("Access-Control-Allow-Methods: *");
date_default_timezone_set('Asia/Bangkok');   
    
include '../conn.php';
        
$action_datetime = date("Y-m-d H:i:s");

$strSQL = "UPDATE `customer` SET `title_name`='".$_POST["title_name"]."',`firstname`='".$_POST["firstname"]."'
,`lastname`='".$_POST["lastname"]."',`citizen_id`='".$_POST["citizen_id"]."',`address`='".$_POST["address"]."',`zipcode`='".$_POST["zipcode"]."',`tel`='".$_POST["tel"]."',`email`='".$_POST["email"]."',`remark`='".$_POST["remark"]."'
,updated_date='".$action_datetime."' ";
$strSQL .= "WHERE cuscode= '" . $_POST["cuscode"] . "' ";
$stmt = $conn->prepare($strSQL);

if ($stmt->execute())
    $response = ['status' => 1, 'message' => 'แก้ไขลูกค้ารหัส ' . $_POST["cuscode"] . ' สำเร็จ'];
else
    $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];

echo json_encode($response);
