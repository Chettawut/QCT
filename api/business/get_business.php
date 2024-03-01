<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include '../conn.php';

$sql = "SELECT businessno,CONCAT(title_name, ' ', business_name)as`title_name`, `business_name`,`tel_phone`, `tel_mobile`,active_status FROM `business` ";
$stmt = $conn->prepare($sql);
$stmt->execute();
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

http_response_code(200);
echo json_encode($data);
