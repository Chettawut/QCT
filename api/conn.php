<?php
class DbConnect {
	private $server = 'localhost';

	private $user = "chairat1_db"; //
	private $pass = "Gxh.2411"; //
	private $dbname = "chairat1_db";

	public function connect() {
		try {
			$conn = new PDO("mysql:host=$this->server;dbname=$this->dbname", $this->user, $this->pass);
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$conn->exec("set names utf8mb4");
			return $conn;
		} catch (\Exception $e) {
			echo "Database Error: " . $e->getMessage();
		}
		// return mysqli_connect($this->server, $this->user, $this->pass, $this->dbname);
		// // mysqli_set_charset($conn,"utf8");
		// if ( mysqli_connect_errno() ) {
		// 	// If there is an error with the connection, stop the script and display the error.
		// 	exit('Failed to connect to MySQL: ' . mysqli_connect_error());
		// }
	}
	
}
$db = new DbConnect;
return $conn = $db->connect();

?>