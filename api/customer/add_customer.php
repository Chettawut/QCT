<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include '../conn.php';


$sql = "INSERT INTO customer (`cuscode`, `title_name`, `firstname`, `lastname`, `citizen_id`, `member_code`, `member_date`, `dateofbirth`, `address`, `zipcode`, `tel`, `email`, `active_status`) ";
//  ,`s_date`,`s_time`, s_user) ";
$sql .= " VALUES ('".$_POST["cuscode"]."','".$_POST["title_name"]."','".$_POST["firstname"]."','".$_POST["lastname"]."','".$_POST["citizen_id"]."','".$_POST["member_code"]."','".$_POST["member_date"]."','".$_POST["dateofbirth"]."','".$_POST["address"]."','".$_POST["zipcode"]."','".$_POST["tel"]."','".$_POST["email"]."','Y' ";
$sql .= ")";
$stmt = $conn->prepare($sql);

if ($stmt->execute()) {
    $response = ['status' => 1, 'message' => 'เพิ่มลูกค้าสำเร็จ'];
} else {
    $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];
}
echo json_encode($response);
