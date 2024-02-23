<?php
ob_start(); 
include_once(dirname(__FILE__, 2)."/onload.php");
http_response_code(400);
$db = new DbConnect;
$conn = $db->connect();


if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $rest_json = file_get_contents("php://input");
    $_POST = json_decode($rest_json, true);

    extract($_POST, EXTR_OVERWRITE, "_");  
    $packingset_name_cdt = !empty($packingset_name) ? "and a.packingset_name like '%$packingset_name%'" : "";
    $created_date_cdt = "";
    if( !empty($created_form) && !empty($created_to) ) {
        $created_date_cdt = "and date_format( a.created_date, '%Y-%m-%d' ) >= '$created_form' and date_format( a.created_date, '%Y-%m-%d' ) <= '$created_to' ";
    } 
    $created_by_cdt = !empty($created_by) ? "and sub.created_name like '%$created_by%'" : ""; 
    // $delivery_date_cdt = "";
    // if( !empty($dndate_form) && !empty($dndate_to) ) {
    //     $delivery_date_cdt = "and date_format( d.dndate, '%Y-%m-%d' ) >= '$dndate_form' and date_format( d.dndate, '%Y-%m-%d' ) <= '$dndate_to' ";
    // } 

    try {   
        $sql = $sql = "SELECT a.pocode,a.podate,b.stcode,d.stname,a.supcode,c.supname,a.active_status ";
        $sql .= " FROM `pomaster` as a inner join `podetail` as b on (a.pocode)=(b.pocode)";
        $sql .= " inner join `supplier` as c on (a.supcode)=(c.supcode)";
        $sql .= " inner join `items` as d on (b.stcode)=(d.stcode)";

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