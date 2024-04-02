<?php
	error_reporting(E_ERROR | E_PARSE);
	ini_set('display_errors', 1);
	// header("Access-Control-Allow-Origin: *");
	// header("Access-Control-Allow-Headers: *");
	// header("Access-Control-Allow-Methods: *");
	
	include '../conn.php';

	extract($_POST, EXTR_OVERWRITE, "_");  
    $stcode = !empty($stcode) ? "and a.stcode like '%$stcode%'" : "";
	$stname = !empty($stname) ? "and a.stname like '%$stname%'" : "";
    // $created_date_cdt = "";
    // if( !empty($created_form) && !empty($created_to) ) {
    //     $created_date_cdt = "and date_format( a.created_date, '%Y-%m-%d' ) >= '$created_form' and date_format( a.created_date, '%Y-%m-%d' ) <= '$created_to' ";
    // } 
    // $created_by_cdt = !empty($created_by) ? "and sub.created_name like '%$created_by%'" : ""; 
    // $delivery_date_cdt = "";
    // if( !empty($dndate_form) && !empty($dndate_to) ) {
    //     $delivery_date_cdt = "and date_format( d.dndate, '%Y-%m-%d' ) >= '$dndate_form' and date_format( d.dndate, '%Y-%m-%d' ) <= '$dndate_to' ";
    // } 

    try {   
        $sql = "SELECT a.stcode, a.stname, b.typename, a.unit, a.price ,a.active_status as statusitem  FROM `items` as a
		 left outer join `itemtype` as b on (a.typecode=b.typecode)
            where 1 = 1
            $stcode
			$stname
            -- $created_date_cdt
		order by a.created_date desc;";

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
	
?>