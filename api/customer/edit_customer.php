<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
date_default_timezone_set('Asia/Bangkok');   
    
include '../conn.php';
        
$action_datetime = date("Y-m-d H:i:s");

$strSQL = "UPDATE `customer` SET `title_name`='".$_POST["firstname"]."',`firstname`='".$_POST["firstname"]."'
,`lastname`='".$_POST["firstname"]."',`citizen_id`='".$_POST["firstname"]."',`member_code`='".$_POST["firstname"]."',`member_date`='".$_POST["firstname"]."'
,`dateofbirth`='".$_POST["firstname"]."',`address`='".$_POST["firstname"]."',`zipcode`='".$_POST["firstname"]."',`tel`='".$_POST["firstname"]."',`email`='".$_POST["firstname"]."'
,updated_date='".$action_datetime."' ";
$strSQL .= "WHERE cuscode= '" . $_POST["cuscode"] . "' ";
$stmt = $conn->prepare($strSQL);

if ($stmt->execute())
    $response = ['status' => 1, 'message' => 'แก้ไขลูกค้ารหัส ' . $_POST["cuscode"] . ' สำเร็จ'];
else
    $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];

echo json_encode($response);
