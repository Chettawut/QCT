<?php
// header('Content-Type: application/json');
header('Content-Type: text/html; charset=utf-8');

include('../conn.php');
date_default_timezone_set("Asia/Bangkok");
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');

$sql = "SELECT number FROM `cuscode` ";
$query = mysqli_query($conn, $sql);
$row = $query->fetch_assoc();
$code = sprintf("%05s", ($row["number"] + 1));

$strSQL = "INSERT INTO customer (`cuscode`, `cusname`, `idno`, `road`, `subdistrict`, `district`, `province`, `zipcode`, `tel`, `fax`, `taxnumber`, `email`, `status` ";
$strSQL .= ",`s_date`,`s_time`) ";
$strSQL .= " VALUES ('" . $code . "','" . $_POST["Addcusname"] . "','" . $_POST["Addidno"] . "','" . $_POST["Addroad"] . "','" . $_POST["Addsubdistrict"] . "' ";
$strSQL .= " ,'" . $_POST["Adddistrict"] . "','" . $_POST["Addprovince"] . "','" . $_POST["Addzipcode"] . "','" . $_POST["Addtel"] . "','" . $_POST["Addfax"] . "' ";
$strSQL .= " ,'" . $_POST["Addtaxnumber"] . "','" . $_POST["Addemail"] . "','Y' ";
$strSQL .= ",'".date("Y-m-d")."','".date("H:i:s")."')";

$query2 = mysqli_query($conn, $strSQL);

if ($query2) {
    $strSQL = "UPDATE cuscode SET ";
    $strSQL .= "number=number+1 ";
    $strSQL .= " order by id desc LIMIT 1 ";

    $query3 = mysqli_query($conn, $strSQL);
}


if ($query3)
    echo json_encode(array('status' => '1', 'message' => 'เพิ่มลูกค้า '.$_POST["Addcusname"].' สำเร็จ'));
else
    echo json_encode(array('status' => '0', 'message' => 'Error insert data!'));
