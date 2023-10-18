<?php
	session_start();
	include('../conn.php');
	// header('Content-Type: application/json');
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Headers: *');	
	// $rest_json = file_get_contents("php://input");
	// $_POST = json_decode($rest_json, true);

	$sql = "SELECT a.id, a.stcode, a.stname, b.typename, a.unit, a.price ,a.status as statusitem  FROM `items` as a";
	$sql .= " inner join `type` as b on (a.typecode=b.typecode)";
	$query = mysqli_query($conn,$sql);

		$json_result= array();
		
        while($row = $query->fetch_assoc()) {
			
            array_push($json_result,array("id" => $row["id"],"stcode" => $row["stcode"],"stname"=>$row["stname"], "typename"=>$row["typename"], "unit"=>$row["unit"], "statusitem"=>$row["statusitem"]));
        }
        echo json_encode($json_result);
?>