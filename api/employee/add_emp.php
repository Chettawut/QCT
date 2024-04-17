<?php
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 1);

include '../conn.php';



$strSQL = "INSERT INTO `employee`(`empcode`, `firstname`, `lastname`, `nickname`, `citizen_id`, `dateofbirth`, `cur_address`, `tel`, `dateofstart`, `tel2`, `position`, `marital_status`, `education`, `resign_date`, `no_of_children`) ";
$strSQL .= " VALUES ('".$_POST["empcode"]."','".$_POST["firstname"]."','".$_POST["lastname"]."','".$_POST["nickname"]."','".$_POST["citizen_id"]."','".$_POST["dateofbirth"]."','".$_POST["cur_address"]."','".$_POST["tel"]."','".$_POST["dateofstart"]."','".$_POST["tel2"]."' ";
$strSQL .= ",'".$_POST["position"]."','".$_POST["marital_status"]."','".$_POST["education"]."','".$_POST["resign_date"]."','".$_POST["no_of_children"]."' ";	
$strSQL .= ")";	
//var_dump($strSQL);exit();
//var_dump($strSQL);exit();
$stmt = $conn->prepare($strSQL);

if ($stmt->execute()) {
    $response = ['status' => 1, 'message' => 'เพิ่มพนักงาน '.$_POST["firstname"].' '.$_POST["lastname"].' สำเร็จ'];
} else {
    $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];
}

echo json_encode($response);
