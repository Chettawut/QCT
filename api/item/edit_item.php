<?php

date_default_timezone_set("Asia/Bangkok");
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 1);
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: *");
// header("Access-Control-Allow-Methods: *");
date_default_timezone_set("Asia/Bangkok");

include '../conn.php';
extract($_POST, EXTR_OVERWRITE, "_");

$action_username = $token->userid;
$date = date("Y-m-d H:i:s");

$sql = "
UPDATE items 
SET 
stname = :stname, typecode = :typecode, unit = :unit, material_code = :material_code,
count_stock = :count_stock, stname_vat = :stname_vat, brand = :brand, stname_per = :stname_per, stfront = :stfront, stseries = :stseries,
stborder = :stborder, stload = :stload, stspeed = :stspeed, sttw = :sttw, stweight = :stweight, stwidth = :stwidth,stlong = :stlong,min = :min,
sthigh = :sthigh,stchange_round = :stchange_round,stchange_time = :stchange_time,stcar_brand = :stcar_brand,stcar_model = :stcar_model,stock_by_product = :stock_by_product,
remark = :remark,price = :price,price_A = :price_A,price_B = :price_B,active_status = :active_status,updated_by = :updated_by,updated_date = :updated_date
WHERE stcode = :stcode"; 

$stmt = $conn->prepare($sql); 

$stmt->bindParam(":stcode", $stcode);
$stmt->bindParam(":stname", $stname);
$stmt->bindParam(":typecode", $typecode);
$stmt->bindParam(":unit", $unit);
$stmt->bindParam(":material_code", $material_code);
$stmt->bindParam(":count_stock", $count_stock);
$stmt->bindParam(":stname_vat", $stname_vat);
$stmt->bindParam(":brand", $brand);
$stmt->bindParam(":stname_per", $stname_per);
$stmt->bindParam(":stfront", $stfront);
$stmt->bindParam(":stseries", $stseries);
$stmt->bindParam(":stborder", $stborder);
$stmt->bindParam(":stload", $stload);
$stmt->bindParam(":stspeed", $stspeed);
$stmt->bindParam(":sttw", $sttw);
$stmt->bindParam(":stweight", $stweight);
$stmt->bindParam(":stwidth", $stwidth);
$stmt->bindParam(":stlong", $stlong);
$stmt->bindParam(":min", $min);
$stmt->bindParam(":sthigh", $sthigh);
$stmt->bindParam(":stchange_round", $stchange_round);
$stmt->bindParam(":stchange_time", $stchange_time);
$stmt->bindParam(":stcar_brand", $stcar_brand);
$stmt->bindParam(":stcar_model", $stcar_model);
$stmt->bindParam(":stock_by_product", $stock_by_product);
$stmt->bindParam(":remark", $remark);
$stmt->bindParam(":price", $price);
$stmt->bindParam(":price_A", $price_A);
$stmt->bindParam(":price_B", $price_B);
$stmt->bindParam(":active_status", $active_status);
$stmt->bindParam(":updated_by", $action_username);
$stmt->bindParam(":updated_date", $date);

if ($stmt->execute())
    $response = ['status' => 1, 'message' => 'แก้ไขสินค้า ' . $_POST["stcode"] . ' สำเร็จ'];
else
    $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];

echo json_encode($response);