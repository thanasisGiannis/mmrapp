<?php
xdebug_start_trace();
header('Access-Control-Allow-Origin: *');  

session_start();
include('include/config.php');

$rawdata = $_GET['data2b'];

$jsonData = json_decode($rawdata,true);

$name     = $jsonData['name'];
$email    = $jsonData['email'];
$city     = $jsonData['city'];
$country  = $jsonData['country'];

$id = $_SESSION['id'];



// Check connection
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}

$sql = "UPDATE users SET name='".$name."',email='".$email."',city='".$city."',country='".$country."' WHERE id='".$id."';";

if ($conn->query($sql) === TRUE) {
	$output['error'] = "Success"; 

  echo json_encode($output);
} else {
	$output['error'] = $conn->error; 
	echo json_encode($output);
}


xdebug_stop_trace();

?>


