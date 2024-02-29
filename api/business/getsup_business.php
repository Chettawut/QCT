<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include '../conn.php';

$sql = "SELECT `id`, `businessno`, `title_name`, `business_name`, `taxno`, `email`, `address`, `zipcode`, `shipping_address`, `shipping_zipcode`, `contact_person`, `contact_department`, `tel_phone`, `tel_mobile`, `fax`, `active_status`, `create_date`, `update_date`, `create_by`, `update_by` FROM `business` ";
$sql .= " where businessno = '".$_POST['idcode']."'";
$stmt = $conn->prepare($sql);
$stmt->execute();
$data = $stmt->fetch(PDO::FETCH_ASSOC);

http_response_code(200);
echo json_encode($data);