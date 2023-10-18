<?php
	session_start();
	include('../conn.php');
	// header('Content-Type: application/json');
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Headers: *');	
	// $rest_json = file_get_contents("php://input");
	// $_POST = json_decode($rest_json, true);

	$sql = "SELECT cuscode,cusname,idno,road,subdistrict,district,province,zipcode,tel,fax,taxnumber,email,status as statuscus FROM `customer` ";
	$sql .= " where cuscode = '".$_POST['idcode']."'";
	$query = mysqli_query($conn,$sql);

	$json_result=array(
		"cuscode" => array(),
		"cusname" => array(),
		"idno" => array(),
		"road" => array(),
		"subdistrict" => array(),
		"district" => array(),
		"province" => array(),
		"zipcode" => array(),
		"tel" => array(),
		"fax" => array(),
		"taxnumber" => array(),
		"email" => array(),		
		"statuscus" => array()
		
		);
		
        $row = $query->fetch_assoc();
			
			$json_result['cuscode']=$row["cuscode"];
			$json_result['cusname']=$row["cusname"];
			$json_result['idno']=$row["idno"];
			$json_result['road']=$row["road"];
			$json_result['subdistrict']=$row["subdistrict"];
			$json_result['district']=$row["district"];
			$json_result['province']=$row["province"];
			$json_result['zipcode']=$row["zipcode"];
			$json_result['tel']=$row["tel"];
			$json_result['fax']=$row["fax"];
			$json_result['taxnumber']=$row["taxnumber"];
			$json_result['email']=$row["email"];
			$json_result['statuscus']=$row["statuscus"];
        
        echo json_encode($json_result);
		

?>