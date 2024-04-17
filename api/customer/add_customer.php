<?php
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 1);
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: *");
// header("Access-Control-Allow-Methods: *");

include '../conn.php';


$sql = "INSERT INTO customer (`cuscode`, `title_name`, `firstname`, `lastname`, `citizen_id`, `address`, `zipcode`, `tel`, `email`,`remark`, `active_status`) ";
//  ,`s_date`,`s_time`, s_user) ";
$sql .= " VALUES ('".$_POST["cuscode"]."','".$_POST["title_name"]."','".$_POST["firstname"]."','".$_POST["lastname"]."','".$_POST["citizen_id"]."','".$_POST["address"]."','".$_POST["zipcode"]."','".$_POST["tel"]."','".$_POST["email"]."','".$_POST["remark"]."','Y' ";
$sql .= ")";
$stmt = $conn->prepare($sql);

if ($stmt->execute()) {
        $strSQL = "UPDATE cuscode SET ";
        $strSQL .= " number= number+1 ";
        $strSQL .= " order by id desc LIMIT 1 ";

        $stmt3 = $conn->prepare($strSQL);

        if ($stmt3->execute()) {
            http_response_code(200);
            $response = ['status' => 1, 'message' => 'เพิ่มลูกค้าสำเร็จ'];
        }
        else {
            $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];
        }
    } 
  else {
    $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];
}
echo json_encode($response);
