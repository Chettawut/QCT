<?php

$servername = "localhost";
$username = "ninestar_jrs"; // jaroon
$password = "Gxh.2411"; // Gxh.2411
$dbname = "ninestar_jrs";

// Create connection
// $conn = mysqli_connect($servername,$username,$password,$dbname);

$conn = mysqli_connect($servername, $username, $password, $dbname);
mysqli_set_charset($conn,"utf8");
if ( mysqli_connect_errno() ) {
	// If there is an error with the connection, stop the script and display the error.
	exit('Failed to connect to MySQL: ' . mysqli_connect_error());
}
// echo "Connected successfully";
?>