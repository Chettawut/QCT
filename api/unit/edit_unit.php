<?php
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    // header("Access-Control-Allow-Origin: *");
    // header("Access-Control-Allow-Headers: *");
    // header("Access-Control-Allow-Methods: *");
    date_default_timezone_set('Asia/Bangkok');   
    
    include '../conn.php';
        
    $action_datetime = date("Y-m-d H:i:s");

    $sql = "UPDATE unit SET ";
    $sql .= " unit='".$_POST["unitname"]."',active_status='".$_POST["statusunit"]."' ";
    $sql .= ",updated_date='".$action_datetime."' ";
    $sql .= "WHERE unitcode= '".$_POST["unitcode"]."' ";
    $stmt = $conn->prepare($sql);
    
    if ($stmt->execute()) {
        $response = ['status' => 1, 'message' => 'แก้ไข Unit สำเร็จ'];
    } else {
        $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];
    }
    echo json_encode($response);   