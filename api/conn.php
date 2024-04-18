<?php
class DbConnect {
	private $server = 'localhost';

	private $user = "qctautoc_db"; //
	private $pass = "Gxh.2411"; //
	private $dbname = "qctautoc_db";

	public function connect() {
		try {
			$conn = new PDO("mysql:host=$this->server;dbname=$this->dbname", $this->user, $this->pass);
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$conn->exec("set names utf8mb4");
			return $conn;
		} catch (\Exception $e) {
			echo "Database Error: " . $e->getMessage();
		}
	}
	
}
$db = new DbConnect;
return $conn = $db->connect();

?>