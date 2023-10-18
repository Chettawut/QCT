<?php
	session_start();
	include('../conn.php');
	// header('Content-Type: application/json');
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Headers: *');	
	// $rest_json = file_get_contents("php://input");
	// $_POST = json_decode($rest_json, true);

	$sql = "SELECT a.srcode,a.srdate,b.stcode,c.stname,a.srstatus,d.cusname  ";
	$sql .= "FROM srmaster a inner join srdetail as b on (a.srcode=b.srcode)  ";  
	$sql .= "inner join items as c on (b.stcode=c.stcode)  ";  
	$sql .= "left outer join customer as d on (a.cuscode=d.cuscode)  ";  
	// $sql .= " where a.srstatus = 'Y' ";  

	$query = mysqli_query($conn,$sql);

	// echo $sql;

	$json_result= array();
		
        while($row = $query->fetch_assoc()) {
			array_push($json_result,array("srcode" => $row["srcode"],"srdate" => $row["srdate"],"srstatus" => $row["srstatus"],"cusname" => $row["cusname"]));
        }
        echo json_encode($json_result);



?>