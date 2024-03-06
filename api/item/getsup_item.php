<?php
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include '../conn.php';

$sql = " SELECT a.*,b.typename ";
$sql .= " FROM `items` as a ";
$sql .= " left outer join `itemtype` as b on (a.typecode=b.typecode) ";
$sql .= " where a.stcode = '" . $_POST['idcode'] . "'";
$stmt = $conn->prepare($sql);
$stmt->execute();
$data = $stmt->fetch(PDO::FETCH_ASSOC);

http_response_code(200);
echo json_encode($data);
