<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: *");
// header("Access-Control-Allow-Methods: *");

include '../conn.php';

$sql = "SELECT carno, cusno, province, brand, car_type, car_model, car_cc, front_tire, back_tire, color, avg_daydistance, modelcode, 
car_speed, car_chassisno, car_loading, car_engineno, remark, business_car, active_status FROM car";
$sql .= " where carno = '".$_POST['idcode']."'";
$stmt = $conn->prepare($sql);
$stmt->execute();
$data = $stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode($data);
