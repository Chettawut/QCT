<?php
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");
    header("Access-Control-Allow-Methods: *");
    
    include '../conn.php';
        

    $sql = "UPDATE itemtype SET ";
    $sql .= " itemtype='".$_POST["typename"]."',status='".$_POST["statusunit"]."' ";
    $sql .= ",e_date='".date("Y-m-d")."',e_time='".date("H:i:s")."',e_user='0' ";
    $sql .= "WHERE typecode= '".$_POST["typecode"]."' ";
    $stmt = $conn->prepare($sql);
    
    if ($stmt->execute()) {
        $response = ['status' => 1, 'message' => 'แก้ไข Itemtype สำเร็จ'];
    } else {
        $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];
    }
    echo json_encode($response);   