<?php
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");
    header("Access-Control-Allow-Methods: *");
    date_default_timezone_set('Asia/Bangkok');   
    
    include '../conn.php';
        
    $action_datetime = date("Y-m-d H:i:s");

include '../conn.php';

$strSQL = "UPDATE supplier SET ";
$strSQL .= " supname='" . $_POST["Editsupname"] . "',idno='" . $_POST["Editidno"] . "',road='" . $_POST["Editroad"] . "' ";
$strSQL .= ",subdistrict='" . $_POST["Editsubdistrict"] . "',district='" . $_POST["Editdistrict"] . "',province='" . $_POST["Editprovince"] . "' ";
$strSQL .= ",zipcode='" . $_POST["Editzipcode"] . "',tel='" . $_POST["Edittel"] . "',fax='" . $_POST["Editfax"] . "' ";
$strSQL .= ",taxnumber='" . $_POST["Edittaxnumber"] . "',email='" . $_POST["Editemail"] . "',active_status='" . $_POST["Editstatussup"] . "' ";
$strSQL .= ",update_date='".$action_datetime."' ";
$strSQL .= "WHERE supcode= '" . $_POST["Editsupcode"] . "' ";
$stmt = $conn->prepare($strSQL);

if ($stmt->execute())
    $response = ['status' => 1, 'message' => 'แก้ไขผู้ขาย ' . $_POST["Editsupname"] . ' สำเร็จ'];
else
    $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];

echo json_encode($response);
