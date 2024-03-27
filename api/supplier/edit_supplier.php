<?php
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    // header("Access-Control-Allow-Origin: *");
    // header("Access-Control-Allow-Headers: *");
    // header("Access-Control-Allow-Methods: *");
    date_default_timezone_set('Asia/Bangkok');   
    
    include '../conn.php';
        
    $action_datetime = date("Y-m-d H:i:s");


$strSQL = "UPDATE supplier SET ";
$strSQL .= " supname='" . $_POST["supname"] . "',idno='" . $_POST["idno"] . "',road='" . $_POST["road"] . "' ";
$strSQL .= ",subdistrict='" . $_POST["subdistrict"] . "',district='" . $_POST["district"] . "',province='" . $_POST["province"] . "' ";
$strSQL .= ",zipcode='" . $_POST["zipcode"] . "',tel='" . $_POST["tel"] . "',fax='" . $_POST["fax"] . "' ";
$strSQL .= ",taxnumber='" . $_POST["taxnumber"] . "',email='" . $_POST["email"] . "',active_status='" . $_POST["statussup"] . "' ";
$strSQL .= ",updated_date='".$action_datetime."' ";
$strSQL .= "WHERE supcode= '" . $_POST["supcode"] . "' ";
$stmt = $conn->prepare($strSQL);

if ($stmt->execute())
    $response = ['status' => 1, 'message' => 'แก้ไขผู้ขาย ' . $_POST["supname"] . ' สำเร็จ'];
else
    $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];

echo json_encode($response);
