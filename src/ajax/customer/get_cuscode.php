<?php
	session_start();
	include('../conn.php');
	
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Headers: *');

	$sql = "SELECT number FROM `cuscode` ";
	$query = mysqli_query($conn, $sql);

	$json_result = array(
		"cuscode" => array(),
	);


	$row = $query->fetch_assoc();
	$code = sprintf("%05s", ($row["number"] + 1));

	$json_result['cuscode'] = $code;

	echo json_encode($json_result);

?>
