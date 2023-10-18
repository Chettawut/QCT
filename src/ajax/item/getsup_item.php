<?php
	session_start();
	include('../conn.php');
	// header('Content-Type: application/json');
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Headers: *');	
	// $rest_json = file_get_contents("php://input");
	// $_POST = json_decode($rest_json, true);
	
	$sql = "SELECT stcode,stname,stnameEN FROM `items` ";
	$sql .= " where id = '".$_POST['idcode']."'";
	$query = mysqli_query($conn,$sql);

	$json_result=array(
		"stcode" => array(),
		"stname" => array(),
		"stnameEN" => array()
		
		);
		
        $row = $query->fetch_assoc();
			
			$json_result['stcode']=$row["stcode"];
			$json_result['stname']=$row["stname"];
			$json_result['stnameEN']=$row["stnameEN"];
        
        echo json_encode($json_result);
		

?>