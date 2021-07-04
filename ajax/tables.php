<?php

try{


    $tabla = $_GET['t'];

    $base = new PDO("mysql:host=localhost; dbname=pet_scanner", "root", "");

    $base->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $base->exec("SET CHARACTER SET utf8");


//    $resultado=$base->query("SELECT NOMBRE FROM sala WHERE NOMBRE='$nom_msj'");


    $resultado=$base->query("SHOW FULL TABLES FROM pet_scanner");

    $rows = $resultado->fetchAll(\PDO::FETCH_OBJ);

    echo (json_encode($rows));


}catch(Exception $e){

    echo "Ha habido un error" . $e->GetMessage();
}
?>