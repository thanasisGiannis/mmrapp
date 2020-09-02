<?php
xdebug_start_trace();

$servername="150.140.193.19";
$dbname = "investwebui";
$username = "tecnopolis";
$password = "!bW@3JJw";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";

xdebug_stop_trace();


?>
