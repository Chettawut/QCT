<?php
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 1);
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: *");
// header("Access-Control-Allow-Methods: *");

include '../conn.php';

$sql = "SELECT `empcode`, `firstname`, `lastname`, `nickname`, `citizen_id`, `dateofbirth`, `cur_address`, `tel`, `dateofstart`, `tel2`, `position`, `marital_status`, `education`, `resign_date`, `no_of_children`,`active_status` FROM `employee` ";
$sql .= " where empcode = '".$_POST['idcode']."'";
$stmt = $conn->prepare($sql);
$stmt->execute();
$data = $stmt->fetch(PDO::FETCH_ASSOC);

http_response_code(200);
echo json_encode($data);