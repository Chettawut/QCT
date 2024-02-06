<?php
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
date_default_timezone_set("Asia/Bangkok");

include '../conn.php';

$sql = "SELECT IF(count(stcode)>=1, false, true) as chkdata FROM `items` where stcode = '" . $_POST["stcode"] . "'  ";
$stmt = $conn->prepare($sql);
$stmt->execute();
$res = $stmt->fetch(PDO::FETCH_ASSOC);
extract($res, EXTR_OVERWRITE, "_");

if ($chkdata) {

    $strSQL = "INSERT INTO items (`stcode`, `stname`, `stnameEN`, `stnamedisplay` ";
    $strSQL .= ", `unit`, `typecode`,feature, yield, `multiply`,`supcode`,`procode` ";
    $strSQL .= ",allergen,purpose,enumber,country, remarks, price, `status`,`created_date`) ";
    $strSQL .= "VALUES (";
    $strSQL .= "'" . $_POST["stcode"] . "','" . $_POST["stname"] . "','" . $_POST["stnameEN"] . "','" . $_POST["stnamedisplay"] . "' ";
    $strSQL .= ",'" . $_POST["unit"] . "','" . $_POST["typecode"] . "','" . $_POST["feature"] . "' ";
    $strSQL .= ",'" . $_POST["yield"] . "','" . $_POST["multiply"] . "','" . $_POST["supcode"] . "','" . $_POST["procode"] . "' ";
    $strSQL .= ",'" . $_POST["allergen"] . "','" . $_POST["purpose"] . "','" . $_POST["enumber"] . "','" . $_POST["country"] . "','" . $_POST["remarks"] . "' ";
    $strSQL .= ",'" . $_POST["price"] . "','Y','" . date("Y-m-d H:i:s")."' ";
    $strSQL .= ")";

    $stmt2 = $conn->prepare($strSQL);

    if ($stmt2->execute()) 
        $response = ['status' => 1, 'message' => 'เพิ่มรหัสสินค้า ' . $_POST["Add_stcode"] . ' สำเร็จ'];
    else
        $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];

} 
else {
    $response = ['status' => false, 'stcode' => false, 'message' => 'รหัสสินค้าซ้ำ'];
}

echo json_encode($response);
