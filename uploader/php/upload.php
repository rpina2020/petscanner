<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
$method = $_SERVER['REQUEST_METHOD'];
if($method == "OPTIONS") {
    die();
}

  $file_name =  $_FILES['file']['name']; //getting file name
  $tmp_name = $_FILES['file']['tmp_name']; //getting temp_name of file
  $file_up_name = time().$file_name; //making file name dynamic by adding time before file name
  move_uploaded_file($tmp_name, "files/".$file_up_name); //moving file to the specified folder with dynamic name
?>
