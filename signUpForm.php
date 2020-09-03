<?php
xdebug_start_trace();
header('Access-Control-Allow-Origin: *');  

session_start();
include('include/config.php');

$rawdata = $_GET['data2b'];

$jsonData = json_decode($rawdata,true);

$name     = $jsonData['name'];
$password = password_hash($jsonData['password'], PASSWORD_DEFAULT);
$email    = $jsonData['email'];
$city     = $jsonData['city'];
$country  = $jsonData['country'];





// Check connection
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}

$sql = "INSERT INTO users (name, email, password, city, country)
VALUES ('".$name."', '".$email."', '".$password."','".$city."','".$country."')";

if ($conn->query($sql) === TRUE) {
	$output['error'] = "Success"; 

  echo json_encode($output);
} else {
	$output['error'] = $conn->error; 
	echo json_encode($output);
}


mysqli_close($conn);
session_destroy();

xdebug_stop_trace();

?>


