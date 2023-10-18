<?php
    header('Content-Type: text/html; charset=utf-8');

	include('../conn.php');	
    date_default_timezone_set("Asia/Bangkok");
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Headers: *');	

	$strSQL = "UPDATE customer SET ";
    $strSQL .= " cusname='".$_POST["Editcusname"]."',idno='".$_POST["Editidno"]."',road='".$_POST["Editroad"]."' ";
    $strSQL .= ",subdistrict='".$_POST["Editsubdistrict"]."',district='".$_POST["Editdistrict"]."',province='".$_POST["Editprovince"]."' ";
    $strSQL .= ",zipcode='".$_POST["Editzipcode"]."',tel='".$_POST["Edittel"]."',fax='".$_POST["Editfax"]."' ";
    $strSQL .= ",taxnumber='".$_POST["Edittaxnumber"]."',email='".$_POST["Editemail"]."',status='".$_POST["Editstatuscus"]."' ";
    $strSQL .= ",e_date='".date("Y-m-d")."',e_time='".date("H:i:s")."',e_user='0' ";
    $strSQL .= "WHERE cuscode= '".$_POST["Editcuscode"]."' ";

    
	$query = mysqli_query($conn,$strSQL);    

        if($query) {
            echo json_encode(array('status' => '1','message'=> 'แก้ไขลูกค้า '.$_POST["Editcusname"].' สำเร็จ'));
        }
        else
        {
            echo json_encode(array('status' => '0','message'=> $strSQL));
        }
    
		

?>