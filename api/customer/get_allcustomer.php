<?php
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include '../conn.php';

$sql = "SELECT cuscode, cuscode, unit, price FROM `customer` where active_status = 'Y'";
$stmt = $conn->prepare($sql);
$stmt->execute();
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($data);