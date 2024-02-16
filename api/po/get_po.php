<?php
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include '../conn.php';

$sql = "SELECT a.pocode,a.podate,a.supcode,b.supname,a.active_status ";
$sql .= " FROM `pomaster` as a inner join supplier as b on (a.supcode)=(b.supcode)";
$stmt = $conn->prepare($sql);
$stmt->execute();
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

http_response_code(200);
echo json_encode(array('data' => $data,'status' => '1', 'message' => 'Success.'));
// echo json_encode($data);
