<?php
session_start();

include('include/config.php');

$rawdata = $_GET['data2b'];

$jsonData = json_decode($rawdata,true);

$walking_constraint = $jsonData['walking_constraint'];

$id = $_SESSION['id'];

if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}

$sql = "UPDATE users SET walking_constraint='".$walking_constraint."'WHERE id='".$id."';";



if ($conn->query($sql) === TRUE) {
	$output['error'] = "Success"; 

  echo json_encode($output);
} else {
	$output['error'] = $conn->error; 
	echo json_encode($output);
}

?>
