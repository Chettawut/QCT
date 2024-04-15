<?php

date_default_timezone_set("Asia/Bangkok");
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 1);

date_default_timezone_set("Asia/Bangkok");

include '../conn.php';
extract($_POST, EXTR_OVERWRITE, "_");

$action_username = $token->userid;
$date = date("Y-m-d H:i:s");

$sql = "
UPDATE car 
SET 
cusno = :cusno, province = :province, brand = :brand, car_type = :car_type,
car_model = :car_model, car_cc = :car_cc, front_tire = :front_tire, back_tire = :back_tire, color = :color, avg_daydistance = :avg_daydistance,
modelcode = :modelcode, car_speed = :car_speed, car_chassisno = :car_chassisno, car_loading = :car_loading, car_engineno = :car_engineno, remark = :remark,business_car = :business_car,
active_status = :active_status,updated_by = :updated_by,updated_date = :updated_date
WHERE carno = :carno"; 

$stmt = $conn->prepare($sql); 

$stmt->bindParam(":carno", $carno);
$stmt->bindParam(":cusno", $cusno);
$stmt->bindParam(":province", $province);
$stmt->bindParam(":brand", $brand);
$stmt->bindParam(":car_type", $car_type);
$stmt->bindParam(":car_model", $car_model);
$stmt->bindParam(":car_cc", $car_cc);
$stmt->bindParam(":front_tire", $front_tire);
$stmt->bindParam(":back_tire", $back_tire);
$stmt->bindParam(":color", $color);
$stmt->bindParam(":avg_daydistance", $avg_daydistance);
$stmt->bindParam(":modelcode", $modelcode);
$stmt->bindParam(":car_speed", $car_speed);
$stmt->bindParam(":car_chassisno", $car_chassisno);
$stmt->bindParam(":car_loading", $car_loading);
$stmt->bindParam(":car_engineno", $car_engineno);
$stmt->bindParam(":remark", $remark);
$stmt->bindParam(":business_car", $business_car);
$stmt->bindParam(":active_status", $active_status);
$stmt->bindParam(":updated_by", $action_username);
$stmt->bindParam(":updated_date", $date);

if ($stmt->execute())
    $response = ['status' => 1, 'message' => 'แก้ไขรถ ' . $_POST["carno"] . ' สำเร็จ'];
else
    $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];

echo json_encode($response);