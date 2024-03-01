<?php
	error_reporting(E_ERROR | E_PARSE);
	ini_set('display_errors', 1);
	// header("Access-Control-Allow-Origin: *");
	// header("Access-Control-Allow-Headers: *");
	// header("Access-Control-Allow-Methods: *");
	
	include '../conn.php';

	$sql = "SELECT a.stcode, a.stname, b.typename, a.unit, a.price ,a.active_status as statusitem  FROM `items` as a";
	$sql .= " inner join `itemtype` as b on (a.typecode=b.typecode)";
	$sql .= " order by a.created_date desc";
	

	$stmt = $conn->prepare($sql);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode($data);
	
?>