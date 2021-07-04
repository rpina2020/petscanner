<?php
    // $server = "localhost";
    // $db_username = "root";
    // $db_password = "";
    // $db_name = "admin_atiendaya";
    // $conn = new PDO("mysql:host=$server;dbname=$db_name",$db_username,$db_password);

	$dbhost = 'localhost';
	$dbname = 'admin_atiendaya';  
	$dbuser = 'root';                  
	$dbpass = '';                  

	try{

		$dbcon = new PDO("mysql:host={$dbhost};dbname={$dbname}",$dbuser,$dbpass);
		$dbcon->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
	}catch(PDOException $ex){

		die($ex->getMessage());
	}

?>