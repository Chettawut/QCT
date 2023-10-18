<?php
	header('Content-Type: application/json');
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Headers: *');
	include('conn.php');

	$sql = "SELECT b.amount ,a.stcode,a.stname,a.unit,c.typename,a.status ";
	$sql .= "FROM items a inner join stock as b on (a.stcode=b.stcode) ";  
	$sql .= " inner join `type` as c on (a.typecode=c.typecode) ";  
	$sql .= " where b.places = 1 ";  

	$query = mysqli_query($conn,$sql);

	// echo $sql;

	$json_result=array(
		"stcode" => array(),
		"stname" => array(),
		"amount" => array(),
		"unit" => array(),
		"typename" => array(),
		"status" => array()
		
		);
		
        while($row = $query->fetch_assoc()) {
			array_push($json_result['stcode'],$row["stcode"]);
			array_push($json_result['stname'],$row["stname"]);
			array_push($json_result['amount'],$row["amount"]);
			array_push($json_result['unit'],$row["unit"]);
			array_push($json_result['typename'],$row["typename"]);
			array_push($json_result['status'],$row["status"]);
        }
        echo json_encode($json_result);



?>