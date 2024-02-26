<?php 
ob_start(); 
include_once(dirname(__FILE__, 2)."/onload.php");
include_once(dirname(__FILE__, 2)."/common/fnc-code.php");

$db = new DbConnect;
$conn = $db->connect();
$conn->beginTransaction();
http_response_code(400);
try {
    $action_date = date("Y-m-d H:i:s"); 
    $action_user = $token->userid;

    if ($_SERVER["REQUEST_METHOD"] == "POST"){
        $rest_json = file_get_contents("php://input");
        $_POST = json_decode($rest_json, true); 
        extract($_POST, EXTR_OVERWRITE, "_");

        // var_dump($_POST);
        $sql = "insert pomaster (pocode, supcode, podate,deldate,payment,poqua,remark,created_by,updated_by) 
        values (:pocode,:supcode,:podate,:deldate,:payment,:poqua,:remark,:action_user,:action_user)";

        $stmt = $conn->prepare($sql);
        if(!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}"); 

        $header = (object)$header;  
        $stmt->bindParam(":pocode", $header->pocode, PDO::PARAM_STR);
        $stmt->bindParam(":supcode", $header->supcode, PDO::PARAM_STR);
        $stmt->bindParam(":podate", $header->podate, PDO::PARAM_STR);
        $stmt->bindParam(":deldate", $header->deldate, PDO::PARAM_STR);
        $stmt->bindParam(":payment", $header->payment, PDO::PARAM_STR);
        $stmt->bindParam(":poqua", $header->poqua, PDO::PARAM_STR); 
        $stmt->bindParam(":remark", $header->remark, PDO::PARAM_STR); 
        $stmt->bindParam(":action_user", $action_user, PDO::PARAM_INT); 

        if(!$stmt->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Insert data error => $error");
            die;
        }

        $sql2 = " update options set maxpocode = maxpocode+1 WHERE year= '".date("Y")."' ";        

        $stmt2 = $conn->prepare($sql2);
        if(!$stmt2) throw new PDOException("Insert data error => {$conn->errorInfo()}"); 
        if(!$stmt2->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Insert data error => $error");
            die;
        }

        $id = $conn->lastInsertId();
        // var_dump($master); exit;

        $sql = "insert into podetail (pocode,pono,amount,stcode,price)
        values (:pocode,:pono,:amount,:stcode,:price)";
        $stmt = $conn->prepare($sql);
        if(!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

       // $detail = $detail;  
        foreach( $detail as $ind => $val){
            $val = (object)$val;
            $stmt->bindParam(":pocode", $header->pocode, PDO::PARAM_STR);
            $stmt->bindParam(":pono", $ind, PDO::PARAM_INT);
            $stmt->bindParam(":amount", $val->amount, PDO::PARAM_INT);
            $stmt->bindParam(":stcode", $val->stcode, PDO::PARAM_STR); 
            $stmt->bindParam(":price", $val->price, PDO::PARAM_INT);
            if(!$stmt->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error"); 
            }
        } 

        $conn->commit();
        http_response_code(200);
        echo json_encode(array("data"=> array("id" => $id)));

    } else  if($_SERVER["REQUEST_METHOD"] == "PUT"){
        $rest_json = file_get_contents("php://input");
        $_PUT = json_decode($rest_json, true); 
        extract($_PUT, EXTR_OVERWRITE, "_");

        // var_dump($_POST);
        $sql = "
        update packingset 
        set
        packingset_name = :packingset_name,
        packingset_groupid = :packingset_groupid,
        unit_cost = :unit_cost,
        fill_volume = :fill_volume,
        declared = :declared,
        remark = :remark,
        updated_date = CURRENT_TIMESTAMP(),
        updated_by = :action_user
        where id = :id";

        $stmt = $conn->prepare($sql);
        if(!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}"); 

        $header = (object)$header; 
        // $master->srstatus = "Y"; 
        $stmt->bindParam(":packingset_name", $header->packingset_name, PDO::PARAM_STR);
        $stmt->bindParam(":packingset_groupid", $header->packingset_groupid, PDO::PARAM_INT);
        $stmt->bindParam(":unit_cost", $header->unit_cost, PDO::PARAM_STR);
        $stmt->bindParam(":fill_volume", $header->fill_volume, PDO::PARAM_STR);
        $stmt->bindParam(":declared", $header->declared, PDO::PARAM_STR);
        $stmt->bindParam(":remark", $header->remark, PDO::PARAM_STR); 
        $stmt->bindParam(":action_user", $action_user, PDO::PARAM_INT);  
        $stmt->bindParam(":id", $header->id, PDO::PARAM_INT); 

        if(!$stmt->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Insert data error => $error");
            die;
        }

        $sql = "delete from packingset_detail where packingsetid = :id";
        $stmt = $conn->prepare($sql);
        if (!$stmt->execute([ 'id' => $header->id ])){
            $error = $conn->errorInfo();
            throw new PDOException("Remove data error => $error");
        }

        $sql = "insert into packingset_detail (packingsetid,pkid,pcs_carton,created_by,created_date)
        values (:packingsetid,:pkid,:pcs_carton,:action_user,CURRENT_TIMESTAMP())";
        $stmt = $conn->prepare($sql);
        if(!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

       // $detail = $detail;  
        foreach( $detail as $ind => $val){
            $val = (object)$val;
            $stmt->bindParam(":packingsetid", $header->id, PDO::PARAM_INT);
            $stmt->bindParam(":pkid", $val->id, PDO::PARAM_STR);
            $stmt->bindParam(":pcs_carton", $val->pcs_carton, PDO::PARAM_INT);
            $stmt->bindParam(":action_user", $val->remark, PDO::PARAM_STR);
            if(!$stmt->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error"); 
            }
        } 
        
        $conn->commit();
        http_response_code(200);
        echo json_encode(array("data"=> array("id" => $code)));
    } else  if($_SERVER["REQUEST_METHOD"] == "DELETE"){
        // $code = $_DELETE["code"];
        $code = $_GET["code"];
        
        $sql = "delete from packingset where id = :id";
        $stmt = $conn->prepare($sql); 
        if (!$stmt->execute([ 'id' => $code ])){
            $error = $conn->errorInfo();
            throw new PDOException("Remove data error => $error");
        }            
        
        $sql = "delete from packingset_detail where packingsetid = :id";
        $stmt = $conn->prepare($sql); 
        if (!$stmt->execute([ 'id' => $code ])){
            $error = $conn->errorInfo();
            throw new PDOException("Remove data error => $error");
        }

        $conn->commit();
        http_response_code(200);
        echo json_encode(array("status"=> 1));
    } else  if($_SERVER["REQUEST_METHOD"] == "GET"){
        $code = $_GET["code"]; 
        $sql = "SELECT a.pocode,a.podate,a.supcode,c.supname,CONCAT(c.idno ,' ', c.road,' ', c.subdistrict,' ', c.district) as address,a.deldate,a.payment,a.poqua,a.remark ";
        $sql .= " FROM `pomaster` as a ";
        $sql .= " inner join `supplier` as c on (a.supcode)=(c.supcode)";
        $sql .= " where a.pocode = :id";
        
        $stmt = $conn->prepare($sql); 
        if (!$stmt->execute([ 'id' => $code ])){
            $error = $conn->errorInfo(); 
            http_response_code(404);
            throw new PDOException("Geting data error => $error");
        }
        $header = $stmt->fetch(PDO::FETCH_ASSOC);

        $sql = "SELECT a.pocode,b.stcode,d.stname ";
        $sql .= " FROM `pomaster` as a inner join `podetail` as b on (a.pocode)=(b.pocode)";
        $sql .= " inner join `supplier` as c on (a.supcode)=(c.supcode)";
        $sql .= " inner join `items` as d on (b.stcode)=(d.stcode)";
        $sql .= " where a.pocode = :id";
        
        $stmt = $conn->prepare($sql); 
        if (!$stmt->execute([ 'id' => $code ])){
            $error = $conn->errorInfo(); 
            http_response_code(404);
            throw new PDOException("Geting data error => $error");
        }
        $detail = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $conn->commit();
        http_response_code(200);
        echo json_encode(array('status' => 1, 'data' => array( "header" => $header, "detail" => $detail )));
    }

} catch (PDOException $e) { 
    $conn->rollback();
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
} catch (Exception $e) { 
    $conn->rollback();
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
} finally{
    $conn = null;
}  
ob_end_flush(); 
exit;