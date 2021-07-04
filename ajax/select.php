<?php
try{
    $rst = [];
    $tabla = $_GET['t'];

    include("columns_table.php");
    $rst["columns"] = $rows_columns;

    $base = new PDO("mysql:host=localhost; dbname=admin_atiendaya", "root", "");
    $base->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $base->exec("SET CHARACTER SET utf8");
    
    /*------------------------------------------------------------------------------------------*/
    $resultado=$base->query("SELECT * FROM ".$tabla);
    $rows = $resultado->fetchAll(\PDO::FETCH_OBJ);
    //echo (json_encode($rows));
    /*------------------------------------------------------------------------------------------*/
    
    $rst["data"] = $rows;

    echo ( json_encode($rst) );
    //echo (json_encode($rows_columns));
    /*------------------------------------------------------------------------------------------*/

}catch(Exception $e){
    echo "Ha habido un error" . $e->GetMessage();
}

?>