<?php
xdebug_start_trace();
header('Access-Control-Allow-Origin: *');  

session_start();
include('include/config.php');

$rawdata = $_GET['data2b'];

$jsonData = json_decode($rawdata,true);

$email = $jsonData['email'];
$password = $jsonData['password']; ;//password_hash($jsonData['password'],PASSWORD_DEFAULT);


$_SESSION['id'] = -1;
// Check connection
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}

$sql ='SELECT * FROM users WHERE (name="'.$email.'" or email="'.$email.'")';

$result = mysqli_query($conn, $sql);


if (mysqli_num_rows($result) > 0) {
  while($row = mysqli_fetch_assoc($result)) {
	if(password_verify($password, $row['password'])){

		 $output['name']   			    = $row['name'];
		 $output['email']   				 = $row['email'];
		 $output['status'] 				 = $row['status'];
		 $output['country'] 				 = $row['country'];
		 $output['city'] 					 = $row['city'];
		 $output['walkingtime'] 		 = $row['walkingtime'];
		 $output['transfers'] 			 = $row['transfers'];
		 $output['economic'] 			 = $row['economic'];
		 $output['accessrouting'] 		 = $row['accessrouting'];
		 $output['walking_constraint'] = $row['walking_constraint'];
		 $_SESSION['id'] = $row['id'];

	    echo json_encode($output);
		 break;
	}

  }
}







//mysqli_close($conn);
//session_destroy();

xdebug_stop_trace();

?>


