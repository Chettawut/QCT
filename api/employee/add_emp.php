<?php
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
date_default_timezone_set("Asia/Bangkok");
include '../conn.php';

$action_date = date("Y-m-d H:i:s"); 
$action_user = $token->userid;

// var_dump($_POST);
$sql = "insert employee 
(`empcode`, `firstname`, `lastname`, `nickname`, `citizen_id`, `dateofbirth`, `cur_address`, `tel`, `dateofstart`, `tel2`, `position`, `marital_status`, `education`, `resign_date`, `no_of_children`) 
values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
if(!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}"); 

$master = (object)$master; 
$srstatus = "pending"; 
$stmt->bindParam(1, $master->srcode, PDO::PARAM_STR);
$stmt->bindValue(2, $master->srdate, PDO::PARAM_STR);
$stmt->bindValue(3, $master->cuscode, PDO::PARAM_STR);
$stmt->bindValue(4, $master->description, PDO::PARAM_STR);
$stmt->bindValue(5, $srstatus, PDO::PARAM_STR);
$stmt->bindValue(6, $action_date, PDO::PARAM_STR);
$stmt->bindValue(7, $action_user, PDO::PARAM_INT);
$stmt->bindValue(8, $action_date, PDO::PARAM_STR);
$stmt->bindValue(9, $action_user, PDO::PARAM_INT);
$stmt->bindValue(10, $master->description, PDO::PARAM_STR);
$stmt->bindValue(11, $srstatus, PDO::PARAM_STR);
$stmt->bindValue(12, $action_date, PDO::PARAM_STR);
$stmt->bindValue(13, $action_user, PDO::PARAM_INT);
$stmt->bindValue(14, $action_date, PDO::PARAM_STR);
$stmt->bindValue(15, $action_user, PDO::PARAM_INT);

if ($stmt->execute()) {
    http_response_code(200);
    $response = ['status' => 1, 'message' => 'เพิ่มพนักงาน '.$_POST["Addfirstname"].' '.$_POST["Addlastname"].' สำเร็จ'];
} else {
    $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];
}
echo json_encode($response);
