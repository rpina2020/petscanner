<?php

try{
    $email = $_GET['e'];
    $base = new PDO("mysql:host=localhost; dbname=admin_atiendaya", "root", "");
    $base->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $base->exec("SET CHARACTER SET utf8");
    $resultado=$base->query('SELECT * FROM `usuarios` WHERE `usuarios`.`email` = "'.$email.'"');
    $rows = $resultado->fetchAll(\PDO::FETCH_OBJ);
    $length = sizeof($rows);
    if($rows){
    	echo (json_encode($rows));
    }else{
		$array["exito"] = false;
		echo json_encode($array);
    }
}catch(Exception $e){
    echo "Ha habido un error" . $e->GetMessage();
}

?>