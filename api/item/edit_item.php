<?php

date_default_timezone_set("Asia/Bangkok");
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
date_default_timezone_set("Asia/Bangkok");

include '../conn.php';
extract($_POST, EXTR_OVERWRITE, "_");


$date = date("Y-m-d H:i:s");
$sql = "
UPDATE items 
SET 
stname = :stname, typecode = :typecode, unit = :unit, material_code = :material_code,
count_stock = :count_stock, stname_vat = :stname_vat, brand = :brand, stname_per = :stname_per, stfront = :stfront, stseries = :stseries,
stborder = :stborder, stload = :stload, stspeed = :stspeed, sttw = :sttw, stweight = :stweight, stwidth = :stwidth
, price = :price,
WHERE stcode = :stcode"; 

$stmt = $conn->prepare($sql); 

$stmt->bindParam(":stcode", $stcode);
$stmt->bindParam(":stname", $stname);
$stmt->bindParam(":typecode", $typecode);
$supcode = $supcode ?? 0;
$stmt->bindParam(":stnameEN", $stnameEN);
$stmt->bindParam(":unit", $unit);
$stmt->bindParam(":price", $price);
$stmt->bindParam(":feature", $feature);
$stmt->bindParam(":typecode", $typecode);
$supcode = $supcode ?? 0;
$stmt->bindParam(":supcode", $supcode, PDO::PARAM_INT);
$procode = $procode ?? 0;
$stmt->bindParam(":procode", $procode, PDO::PARAM_INT);
$stmt->bindParam(":yield", $yield);
$stmt->bindParam(":multiply", $multiply);
$stmt->bindParam(":allergen", $allergen);
$stmt->bindParam(":remarks", $remarks);
$stmt->bindParam(":purpose", $purpose);
$stmt->bindParam(":enumber", $enumber);
$stmt->bindParam(":country", $country);
$stmt->bindParam(":status", $status);
$stmt->bindParam(":updated_date", $date);

if ($stmt->execute())
    $response = ['status' => 1, 'message' => 'แก้ไขสินค้า ' . $_POST["stcode"] . ' สำเร็จ'];
else
    $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];

echo json_encode($response);