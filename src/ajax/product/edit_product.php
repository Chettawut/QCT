<?php
	header('Content-Type: application/json');
	include('../../conn.php');
    
    date_default_timezone_set("Asia/Bangkok");

    $strSQL = "UPDATE items SET ";
    $strSQL .= " stname='".$_POST["stname"]."',stnameEN='".$_POST["stnameEN"]."',stnamedisplay='".$_POST["stnamedisplay"]."' ";
    $strSQL .= ",unit='".$_POST["unit"]."',typecode='".$_POST["typecode"]."',feature='".$_POST["feature"]."' ";
    $strSQL .= ",yield='".$_POST["yield"]."',multiply='".$_POST["multiply"]."',supcode='".$_POST["supcode"]."',procode='".$_POST["procode"]."' ";
    $strSQL .= ",allergen='".$_POST["allergen"]."',purpose='".$_POST["purpose"]."',enumber='".$_POST["enumber"]."',country='".$_POST["country"]."',remarks='".$_POST["remarks"]."' ";
    $strSQL .= ",price='".$_POST["price"]."',status='".$_POST["status"]."',e_date='".date("Y-m-d")."',e_time='".date("H:i:s")."',e_user='".$_POST["id"]."' ";
    $strSQL .= "WHERE stcode= '".$_POST["stcode"]."' ";

    
	$query = mysqli_query($conn,$strSQL);
    
    // echo $strSQL;


        if($query) {
            echo json_encode(array('status' => '1','message'=> 'แก้ไขรหัสสินค้า '.$_POST["stcode"].' สำเร็จ'));
        }
        else
        {
            echo json_encode(array('status' => '0','message'=> 'Error insert data!'));
        }
    
        mysqli_close($conn);
?>