<?php

    $sql = "SELECT IFNULL(sum(year), 0) as year FROM options order by year desc LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $res = $stmt->fetch(PDO::FETCH_ASSOC);
    extract($res, EXTR_OVERWRITE, "_");

    if($year!=date("Y"))
    {
        $StrSQL = "INSERT INTO options (`year`) ";
        $StrSQL .= "VALUES (";
        $StrSQL .= "'".date("Y")."' ";
        $StrSQL .= ")";
        $stmt = $conn->prepare($StrSQL);
        $stmt->execute();	

    }
?>