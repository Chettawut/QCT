<?php 

function create_items_with_spcode($pdo, $spcode){
    $sql = "insert into items (stcode, stname, typecode, remarks, status, created_date, created_by, updated_date, updated_by) 
            select 
                spcode,
                spname,
                ( select typecode from type where typename = 'Finish Goods' order by updated_date desc, created_date desc limit 1 ) typecode,
                concat( 'create with sample preparation code ', spcode ) remark,
                'Y' status,
                created_date, created_by, updated_date, updated_by
            from spmaster 
            where spcode = :code
            and not exists (select 1 from items where stcode = :code)";
    $stmt = $pdo->prepare($sql); 
    if (!$stmt->execute([ 'code' => $spcode])){
        $error = $pdo->errorInfo(); 
        http_response_code(401);
        throw new PDOException("Insert items error => $error");
    }
}