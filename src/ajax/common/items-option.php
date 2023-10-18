<?php 
include_once(dirname(__FILE__, 2)."/onload.php");

if ($_SERVER["REQUEST_METHOD"] == "GET"){
    extract($_GET, EXTR_OVERWRITE, "_"); 
    $type_code = !empty($type) ? "and i.typecode = '$type'" : "";
    try { 
        $p = $p ?? "";
        $res = null;
        if($p == 'items'){
            $sql = "
			select 
                i.*,
                UUID() `key`,
                t.typename
            from items i
            join `type` t on i.typecode = t.typecode
            where 1 = 1 and i.status = 'Y'
                $type_code";

            $query = mysqli_query($conn,$sql); 
            $res = $query->fetch_all(MYSQLI_ASSOC); //MYSQLI_ASSOC 
            $query->free_result();
        }else{
            $sql = "
            select 
                i.stcode value, 
                i.stname label 
            from items i
            where 1 = 1 and i.status = 'Y'
                $type_code"; 

            $query = mysqli_query($conn,$sql); 
            $res = $query->fetch_all(MYSQLI_ASSOC); //MYSQLI_ASSOC 
            $query->free_result();
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
        mysqli_close($conn);
    }    
} else {
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => 'request method fail.'));
}

exit;
?>