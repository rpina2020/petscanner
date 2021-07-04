<?php
try{
    $tabla = $_GET['t'];
    $base = new PDO("mysql:host=localhost; dbname=admin_atiendaya", "root", "");
    $base->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $base->exec("SET CHARACTER SET utf8");
    $resultado=$base->query("SELECT  `COLUMN_TYPE`, `COLUMN_NAME` FROM `INFORMATION_SCHEMA`.`COLUMNS` WHERE `TABLE_SCHEMA` = 'admin_atiendaya' AND `TABLE_NAME` = '".$tabla."'");
    $rows_columns = $resultado->fetchAll(\PDO::FETCH_OBJ);
    //echo (json_encode($rows_columns));
}catch(Exception $e){
    echo "Ha habido un error" . $e->GetMessage();
}
?>