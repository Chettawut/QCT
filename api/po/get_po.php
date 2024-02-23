<?php
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include '../conn.php';

$sql = "SELECT a.pocode,a.podate,b.stcode,d.stname,a.supcode,c.supname,a.active_status ";
$sql .= " FROM `pomaster` as a inner join `podetail` as b on (a.pocode)=(b.pocode)";
$sql .= " inner join `supplier` as c on (a.supcode)=(c.supcode)";
$sql .= " inner join `items` as d on (b.stcode)=(d.stcode)";

// echo $sql;
$stmt = $conn->prepare($sql);
$stmt->execute();
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

http_response_code(200);
echo json_encode(array('data' => $data,'status' => '1', 'message' => 'Success.'));

