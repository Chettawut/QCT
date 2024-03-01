<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
date_default_timezone_set('Asia/Bangkok');   
    
include '../conn.php';
        
$action_datetime = date("Y-m-d H:i:s");

$strSQL = "UPDATE `employee` SET `firstname`='".$_POST["firstname"]."',`lastname`='".$_POST["lastname"]."'
,`nickname`='".$_POST["nickname"]."',`citizen_id`='".$_POST["citizen_id"]."',`dateofbirth`='".$_POST["dateofbirth"]."',`cur_address`='".$_POST["cur_address"]."'
,`tel`='".$_POST["tel"]."',`dateofstart`='".$_POST["dateofstart"]."',`tel2`='".$_POST["tel2"]."',`position`='".$_POST["position"]."',`marital_status`='".$_POST["marital_status"]."'
,`education`='".$_POST["education"]."',`resign_date`='".$_POST["resign_date"]."',`no_of_children`='".$_POST["no_of_children"]."',`active_status`='".$_POST["active_status"]."',updated_date='".$action_datetime."' ";
$strSQL .= "WHERE empcode= '" . $_POST["empcode"] . "' ";
$stmt = $conn->prepare($strSQL);

if ($stmt->execute())
    $response = ['status' => 1, 'message' => 'แก้ไขรหัส ' . $_POST["empcode"] . ' สำเร็จ'];
else
    $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];

echo json_encode($response);
