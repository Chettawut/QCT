<?php
ob_start();
include_once(dirname(__FILE__, 2)."/onload.php");
$db = new DbConnect;
$conn = $db->connect(); 

if ($_SERVER["REQUEST_METHOD"] == "GET"){
    extract($_GET, EXTR_OVERWRITE, "_"); 
    try { 
        $p = $p ?? "";
        $key = $key ?? "";
        $res = null;
        if($p == 'srcode-option'){
            $sql = "select distinct srcode `id`,  srcode `text` from srmaster s;";

            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC); 
        } else if($p == 'paraname-option') {
            $ref_key = ($key != "") ? "and i.spcode = '$key'" : "";
            $sql = "
            select distinct i.paraname `id`, i.paraname `text` 
            from spparameter i
            where 1 = 1 
            $ref_key"; 

            $stmt = $conn->prepare($sql); 
            $stmt->execute();
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC);  
        } else if ($p == 'sample-request-master') {
            $sql = "select s.srcode, s.srdate, s.duedate, s.cuscode, c.cusname, s.description from srmaster s join customer c on s.cuscode = c.cuscode where 1 = 1"; 

            $stmt = $conn->prepare($sql); 
            $stmt->execute();
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC);  
        }

        http_response_code(200);
        echo json_encode(array("data"=>$res));
    } catch (mysqli_sql_exception $e) { 
        http_response_code(400);
        echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
        //throw $exception;
    } catch (Exception $e) { 
        http_response_code(400);
        echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
    } finally{
        // Ignore
        
    }    
} else {
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => 'request method fail.'));
}
ob_end_flush(); 
exit;
?>