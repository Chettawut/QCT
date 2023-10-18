<?php
	header('Content-Type: application/json');
	include('../../conn.php');

	// $_POST['idcode']='100001';
	$strSQL = "SELECT stcode,stname,stnameEN,stnamedisplay,unit,typecode,price,a.status,yield,multiply,b.supcode,b.supname ";
	$strSQL .= ",c.supcode as procode,c.supname as proname,feature,allergen,purpose,enumber,country,remarks ";
	$strSQL .= " FROM `items` as a left outer join supplier as b on (a.supcode=b.supcode) ";
	$strSQL .= " left outer join supplier as c on (a.procode=c.supcode) ";
	$strSQL .= " where stcode = '".$_POST['idcode']."'";
	$query = mysqli_query($conn,$strSQL);
	
	$json_result=array(
		"stcode" => array(),
		"stname" => array(),
		"stnameEN" => array(),
		"stnamedisplay" => array(),
		"unit" => array(),
		"typecode" => array(),
		"price" => array(),			
		"status" => array(),
		"yield" => array(),
		"multiply" => array(),
		"supcode" => array(),			
		"supname" => array(),
		"procode" => array(),			
		"proname" => array(),
		"feature" => array(),
		"allergen" => array(),
		"purpose" => array(),
		"enumber" => array(),
		"country" => array(),			
		"remarks" => array()
        );
		
        while($row = $query->fetch_assoc()) {
			array_push($json_result['stcode'],$row["stcode"]);
			array_push($json_result['stname'],$row["stname"]);
			array_push($json_result['stnameEN'],$row["stnameEN"]);
			array_push($json_result['stnamedisplay'],$row["stnamedisplay"]);
			array_push($json_result['unit'],$row["unit"]);
			array_push($json_result['typecode'],$row["typecode"]);
			array_push($json_result['price'],$row["price"]);
			array_push($json_result['status'],$row["status"]);
			array_push($json_result['yield'],$row["yield"]);
			array_push($json_result['multiply'],$row["multiply"]);
			array_push($json_result['supcode'],$row["supcode"]);
			array_push($json_result['supname'],$row["supname"]);
			array_push($json_result['procode'],$row["procode"]);
			array_push($json_result['proname'],$row["proname"]);			
			array_push($json_result['feature'],$row["feature"]);
			array_push($json_result['allergen'],$row["allergen"]);
			array_push($json_result['purpose'],$row["purpose"]);
			array_push($json_result['enumber'],$row["enumber"]);
			array_push($json_result['country'],$row["country"]);
        }
        echo json_encode($json_result);



?>