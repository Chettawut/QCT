<?php
ob_start(); 
include_once(dirname(__FILE__, 2)."/onload.php");
$db = new DbConnect;
$conn = $db->connect(); 

if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $rest_json = file_get_contents("php://input");
    $_POST = json_decode($rest_json, true);

    extract($_POST, EXTR_OVERWRITE, "_");  
    
    $businessno = !empty($businessno) ? "and businessno like '%$businessno%'" : "";
    $business_name = !empty($business_name) ? "and business_name like '%$business_name%' " : "";
    $tel = !empty($tel) ? "and tel like '%$tel%'" : "";
    
    try {   
        $sql = "SELECT businessno,CONCAT(title_name, ' ', business_name)as`title_name`, `business_name`,`tel`, `tel_mobile`,active_status FROM `business` 
           where 1 = 1
           $businessno
           $business_name        
           $tel
       order by businessno desc;";

        $stmt = $conn->prepare($sql); 
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);  

        http_response_code(200);
        echo json_encode(array("data"=>$res));
    } catch (mysqli_sql_exception $e) { 
        http_response_code(400);
        echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
        //throw $exception;
    } catch (Exception $e) { 
        http_response_code(400);
        echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
    } finally{
        $conn = null;
        
    }    
} else {
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => 'request method fail.'));
}
ob_end_flush(); 
exit;
?>