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

        $sql = "INSERT INTO business (`businessno`, `title_name`, `business_name`, `business_branch`, `branch_details`,`taxno`, `address`, `zipcode`
        , `shipping_address`, `shipping_zipcode`, `contact_person`, `contact_department`, `tel`,`tel_mobile`, `fax`, `email`,`remark`, `active_status`, created_by, created_date) 
        values (:businessno,:title_name,:business_name,:business_branch,:branch_details,:taxno,:address,:zipcode,:shipping_address,:shipping_zipcode
        ,:contact_person,:contact_department,:tel,:tel_mobile,:fax,:email,:remark,'Y',:action_user,:action_user)";

        $stmt = $conn->prepare($sql);
        if(!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}"); 
        
        $stmt->bindParam(":businessno", $businessno, PDO::PARAM_STR);
        $stmt->bindParam(":title_name", $title_name, PDO::PARAM_STR);
        $stmt->bindParam(":business_name", $business_name, PDO::PARAM_STR);        
        $stmt->bindParam(":business_branch", $business_branch, PDO::PARAM_STR);
        $stmt->bindParam(":branch_details", $branch_details, PDO::PARAM_STR);
        $stmt->bindParam(":taxno", $taxno, PDO::PARAM_STR);
        $stmt->bindParam(":address", $address, PDO::PARAM_STR);        
        $stmt->bindParam(":zipcode", $zipcode, PDO::PARAM_STR);
        $stmt->bindParam(":shipping_address", $shipping_address, PDO::PARAM_STR);        
        $stmt->bindParam(":shipping_zipcode", $shipping_zipcode, PDO::PARAM_STR);
        $stmt->bindParam(":contact_person", $contact_person, PDO::PARAM_STR);        
        $stmt->bindParam(":contact_department", $contact_department, PDO::PARAM_STR);
        $stmt->bindParam(":tel", $tel, PDO::PARAM_STR);
        $stmt->bindParam(":tel_mobile", $tel_mobile, PDO::PARAM_STR);        
        $stmt->bindParam(":fax", $fax, PDO::PARAM_STR);
        $stmt->bindParam(":email", $email, PDO::PARAM_STR);        
        $stmt->bindParam(":remark", $remark, PDO::PARAM_STR);        
        $stmt->bindParam(":action_user", $action_user, PDO::PARAM_INT); 
        $stmt->bindParam(":action_user", $action_user, PDO::PARAM_INT); 

        if(!$stmt->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Insert data error => $error");
            die;
        }

        $conn->commit();
        $strSQL = "UPDATE cuscode SET ";
        $strSQL .= " number= number+1 ";
        $strSQL .= " order by id desc LIMIT 1 ";

        $stmt3 = $conn->prepare($strSQL);
        if ($stmt3->execute()) {
            http_response_code(200);
            echo json_encode(array("data"=> array("id" => "ok", 'message' => 'เพิ่มลูกค้าสำเร็จ')));
        }
        else
        {
            $error = $conn->errorInfo();
            throw new PDOException("Insert data error => $error");
            die;
        }        
        

    } else  if($_SERVER["REQUEST_METHOD"] == "PUT"){
        $rest_json = file_get_contents("php://input");
        $_PUT = json_decode($rest_json, true); 
        extract($_PUT, EXTR_OVERWRITE, "_");
        // var_dump($_POST);

        $sql = "
        update customer
        set
        cuscode = :cuscode,
        title_name = :title_name,
        firstname = :firstname,
        lastname = :lastname,
        citizen_id = :citizen_id,
        zipcode = :zipcode,
        tel = :tel,
        email = :email,
        remark = :remark,
        active_status = :active_status,
        updated_date = CURRENT_TIMESTAMP(),
        updated_by = :action_user
        where cuscode = :cuscode";
        
        $stmt = $conn->prepare($sql);
        if(!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}"); 

        
        $stmt->bindParam(":cuscode", $cuscode, PDO::PARAM_STR);
        $stmt->bindParam(":title_name", $title_name, PDO::PARAM_STR);
        $stmt->bindParam(":firstname", $firstname, PDO::PARAM_STR);
        $stmt->bindParam(":lastname", $lastname, PDO::PARAM_STR);
        $stmt->bindParam(":citizen_id", $citizen_id, PDO::PARAM_STR);
        $stmt->bindParam(":zipcode", $zipcode, PDO::PARAM_STR);
        $stmt->bindParam(":tel", $tel, PDO::PARAM_STR);
        $stmt->bindParam(":email", $email, PDO::PARAM_STR);
        $stmt->bindParam(":remark", $remark, PDO::PARAM_STR);
        $stmt->bindParam(":active_status", $active_status, PDO::PARAM_STR);        
        $stmt->bindParam(":action_user", $action_user, PDO::PARAM_INT);  

        if(!$stmt->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Insert data error => $error");
            die;
        } 
        
        $conn->commit();
        http_response_code(200);
        echo json_encode(array("data"=> array("id" => $_PUT)));
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
        $businessno = $_GET["code"]; 
        $sql = "SELECT `businessno`, `title_name`, `business_name`, `business_branch`, `branch_details`,`taxno`, `address`, `zipcode`, `shipping_address`, `shipping_zipcode`, `contact_person`, `contact_department`, `tel`,`tel_mobile`, `fax`, `email`,`remark`, `active_status` ";
        $sql .= " FROM `business` ";
        $sql .= " where businessno = :id";
        
        $stmt = $conn->prepare($sql); 
        if (!$stmt->execute([ 'id' => $businessno ])){
            $error = $conn->errorInfo(); 
            http_response_code(404);
            throw new PDOException("Geting data error => $error");
        }
        $res = $stmt->fetch(PDO::FETCH_ASSOC);  

        $conn->commit();
        http_response_code(200);
        echo json_encode(array("data"=> $res));
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