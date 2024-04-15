<?php
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 1);
date_default_timezone_set("Asia/Bangkok");

include '../conn.php';

$sql = "SELECT IF(count(stcode)>=1, false, true) as chkdata FROM `items` where stcode = '" . $_POST["stcode"] . "'  ";
$stmt = $conn->prepare($sql);
$stmt->execute();
$res = $stmt->fetch(PDO::FETCH_ASSOC);
extract($res, EXTR_OVERWRITE, "_");

if ($chkdata) {

    $strSQL = "INSERT INTO items (`stcode`, `stname`, `unit`, `material_code` ";
    $strSQL .= ", `count_stock`, `typecode`,stname_vat, brand, `stname_per`,`stfront`,`stseries` ";
    $strSQL .= ",stborder,stload,stspeed,sttw, stweight, stwidth, price, `stlong`,`sthigh` ,stcar_brand ";
    $strSQL .= ",stchange_round,stchange_time,stcar_model,remark,price_A,price_B,price_online ";
    $strSQL .= ", `active_status`,`created_date`) ";
    $strSQL .= "VALUES (";
    $strSQL .= "'" . $_POST["stcode"] . "','" . $_POST["stname"] . "','" . $_POST["unit"] . "','" . $_POST["material_code"] . "' ";
    $strSQL .= ",'" . $_POST["count_stock"] . "','" . $_POST["typecode"] . "','" . $_POST["stname_vat"] . "' ";
    $strSQL .= ",'" . $_POST["brand"] . "','" . $_POST["stname_per"] . "','" . $_POST["stfront"] . "','" . $_POST["stseries"] . "' ";
    $strSQL .= ",'" . $_POST["stborder"] . "','" . $_POST["stload"] . "','" . $_POST["stspeed"] . "','" . $_POST["sttw"] . "','" . $_POST["stweight"] . "' ";
    $strSQL .= ",'" . $_POST["stwidth"] . "','" . $_POST["price"] . "','" . $_POST["stlong"] . "','" . $_POST["sthigh"] . "','" . $_POST["stcar_brand"] . "' ";
    $strSQL .= ",'" . $_POST["stchange_round"] . "','" . $_POST["stchange_time"] . "','" . $_POST["stcar_model"] . "','" . $_POST["remark"] . "' ";
    $strSQL .= ",'" . $_POST["price_A"] . "','" . $_POST["price_B"] . "','" . $_POST["price_online"] . "' ";
    $strSQL .= ",'Y','" . date("Y-m-d H:i:s")."')";

    $stmt2 = $conn->prepare($strSQL);

    if ($stmt2->execute()) 
        $response = ['status' => 1, 'message' => 'เพิ่มรหัสสินค้า ' . $_POST["stcode"] . ' สำเร็จ'];
    else
        $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];

} 
else {
    $response = ['status' => false, 'stcode' => false, 'message' => 'รหัสสินค้าซ้ำ'];
}

echo json_encode($response);
